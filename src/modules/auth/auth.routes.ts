import { Router } from "express";
import { authController } from "./auth.controller";
import { validateBody } from "../../middlewares/validate";
import { loginSchema, signupSchema } from "./auth.schema";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/signup", validateBody(signupSchema), authController.signup);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);

export default router;
