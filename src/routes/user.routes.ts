import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { validateToken } from "../helpers/validateToken";

const router = Router();

router.post("/signin", userCtrl.signinUser);

router.post("/signup", userCtrl.signupUser);

router.get("/user", validateToken, userCtrl.getUser);

router.post("/reseat-password", userCtrl.reseatPasword);

router.post("/change-password", validateToken, userCtrl.changePasword);

router.put("/edit-user", validateToken, userCtrl.editUser);

export default router;
