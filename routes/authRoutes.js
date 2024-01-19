import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";

//Router for regiration and login.
// Full url will be http://<your-domain-name-or-localhost:3000>/api/user
const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;