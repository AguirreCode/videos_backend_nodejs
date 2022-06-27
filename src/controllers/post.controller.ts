import { Request, Response } from "express";
import Post from "../models/Post";
import Joi from "@hapi/joi";
import User from "../models/User";

const schemaCreatePost = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(5).max(255).required(),
  url: Joi.string().min(5).max(255).required().uri(),
});

export const createPost = async (req: Request, res: Response) => {
  try {
    //Validate post
    const { error } = schemaCreatePost.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { title, description, url } = req.body;
    const verifyPost = await Post.findOne({ url });
    if (verifyPost)
      return res.status(400).json({ error: "La publicación ya existe" });
    const savedPost = await new Post({
      title,
      description,
      url,
      user_id: req.user,
    });
    await savedPost.save();
    return res.status(200).json({ post: savedPost });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({ all: posts });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const findPost = await Post.findById(id);
    if (!findPost) return res.status(404).json("La publicación no existe");
    return res.status(200).json({ post: findPost });
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    //Validate update post
    const { error } = schemaCreatePost.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { title, description, url } = req.body;
    const updatePost = await Post.findByIdAndUpdate(
      id,
      { title, description, url },
      { new: true }
    );
    if (!updatePost)
      return res.status(400).json("Error al actualizar la publicación");
    return res.status(200).json({ post: updatePost });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const removePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getPost = await Post.findById(id);
    if (!getPost) return res.status(404).json("No existe la publicación");
    const removedPost = await Post.findByIdAndDelete(id);
    return res.json(removedPost);
  } catch (error) {
    return res.status(400).json(error);
  }
};
