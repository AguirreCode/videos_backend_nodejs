import dotenv from "dotenv";

dotenv.config();

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGO_USER: process.env.MONGO_USER || "admin",
  MONGO_PASSWORD: process.env.MONGO_PASS || "admin",
  MONGO_HOST: process.env.MONGO_HOST || "localhost",
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || "secretkey123",
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
};
