import { Router } from "express";
import { registerUserController, resendOtpController, verifyOtpController, loginUserController, loginWithGoogleController } from "../controllers/auth.controller.js";


const router = Router();

router.post("/register", registerUserController);
router.post("/resend-otp", resendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginUserController);
router.post("/login-with-google", loginWithGoogleController);

export default router;