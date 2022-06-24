import express from "express";
import config from "./config";
import postRoutes from "./routes/post.routes";
import userRoutes from "./routes/user.routes";
import morgan from "morgan";
import cors from "cors";
import bodyparser from "body-parser";

const app = express();

app.set("port", config.PORT);

app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use("/post", postRoutes);
app.use("/auth", userRoutes);

export default app;
