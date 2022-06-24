import { Router } from "express";
import * as postCtrl from "../controllers/post.controller";
import { validateToken } from '../helpers/validateToken'

const router = Router();

router.get("/get/all", validateToken, postCtrl.getPosts);

router.get("/get/:id", validateToken, postCtrl.getPost);

router.post("/create", validateToken, postCtrl.createPost);

router.put("/update/:id", validateToken, postCtrl.updatePost);

router.delete("/remove/:id", validateToken, postCtrl.removePost);

export default router;
