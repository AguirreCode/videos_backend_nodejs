import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

interface IPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const payload = jwt.verify(token, config.SECRET_KEY) as IPayload;
    req.user = payload.id;
    return next();
  } catch (error) {
    return res.status(400).json({ error: "Token no válido" });
  }
};

export default validateToken;
