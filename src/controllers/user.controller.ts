import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Joi from "@hapi/joi";
import { encrypt, generatePassword } from "../helpers/password";
import { transporter } from "../helpers/mailer";
import config from "../config";

const schemaCreateUser = Joi.object({
  name: Joi.string().min(4).max(255).required(),
  first_lastname: Joi.string().min(4).max(255).required(),
  second_lastname: Joi.string().min(4).max(255).required(),
  email: Joi.string().min(10).max(255).required().email(),
  password: Joi.string().min(8).max(255).required(),
  confirm_password: Joi.string().min(8).max(255).required(),
});

const schemaGetUser = Joi.object({
  email: Joi.string().min(10).max(255).required().email(),
  password: Joi.string().min(8).max(255).required(),
});

const schemaChangePassword = Joi.object({
  password: Joi.string().min(8).max(255).required(),
  confirm_password: Joi.string().min(8).max(255).required(),
});


const schemaUpdateUser = Joi.object({
  name: Joi.string().min(4).max(255).required(),
  first_lastname: Joi.string().min(4).max(255).required(),
  second_lastname: Joi.string().min(4).max(255).required(),
  email: Joi.string().min(10).max(255).required().email(),
});

export const signupUser = async (req: Request, res: Response) => {
  try {
    //Validate user
    const { error } = schemaCreateUser.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      name,
      first_lastname,
      second_lastname,
      email,
      password,
      confirm_password,
    } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ error: "Ya existe una cuenta con tu correo" });
    if (password !== confirm_password)
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    const newUser = await new User({
      name,
      first_lastname,
      second_lastname,
      email,
      password,
    });
    newUser.password = encrypt(password);
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const signinUser = async (req: Request, res: Response) => {
  try {
    //Validate user
    const { error } = schemaGetUser.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const validPassword = encrypt(password);

    if (validPassword !== user.password)
      return res.status(400).json({ error: "La contraseña es incorrecta" });

    const token = jwt.sign(
      {
        name: user.name,
        first_lastname: user.first_lastname,
        email: user.email,
        id: user._id,
      },
      config.SECRET_KEY,
      { expiresIn: 60 * 60 * 24 }
    );
    user.password = "";
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    user.password = "";
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const reseatPasword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne(email);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    const pass = generatePassword();
    const passEncrypt = encrypt(pass);
    await transporter.sendMail({
      from: '"Restablecer Contraseña" <house.company.col@gmail.com>',
      to: user.email,
      subject: "Tu contraseña ha sido actualizada",
      html: `Tu nueva contraseña es: ${pass}`,
    });
    const userUpdate = await User.findOneAndUpdate(email, {
      password: passEncrypt,
    });
    return res.status(200).json({ user: userUpdate });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const changePasword = async (req: Request, res: Response) => {
  try {
    //Validate user
    const { error } = schemaChangePassword.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });
    const { password, confirm_password } = req.body;
    const user = await User.findById(req.user);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    if (password !== confirm_password)
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    const passEncrypt = encrypt(password);
    const userUpdate = await User.findByIdAndUpdate(req.user, {
      password: passEncrypt,
    });
    return res.status(200).json({ user: userUpdate });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    //Validate user
    const { error } = schemaUpdateUser.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });
    const { email, name, first_lastname, second_lastname } = req.body;
    const user = await User.findById(req.user);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    const userUpdate = await User.findByIdAndUpdate(req.user, {
      email,
      name,
      first_lastname,
      second_lastname,
    });
    return res.status(200).json({ user: userUpdate });
  } catch (error) {
    return res.status(400).json(error);
  }
};
