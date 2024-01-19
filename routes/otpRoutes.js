import express from "express";
import { generateOtp, verifyOtp, simulateToken } from "../controllers/otpControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

//Router for OTP based endpoints
// Full url will be http://<your-domain-name-or-localhost:3000>/api/otp
const otpRouter = express.Router();
otpRouter.post("/generate-otp", authMiddleware, generateOtp);
otpRouter.post("/verify-otp", authMiddleware, verifyOtp);
otpRouter.post("/simulate-token", authMiddleware, simulateToken);

export default otpRouter;