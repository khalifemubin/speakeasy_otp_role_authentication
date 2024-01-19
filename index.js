import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import otpRouter from "./routes/otpRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { dbConnection } from "./config/database.js";
import permissionsRouter from "./routes/permissionRoutes.js";

//Initialize express
const app = express();
const PORT = 3000;

//For enabling json request and response
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
//Enable CORS
app.use(cors());

//API endpoint Router for OTP related routes like generation and verification
app.use('/api/otp', otpRouter);

//API endpoint Router for user related routes like registration and login
app.use('/api/user', authRouter);


/**
 * ASSUMPTION -> I am assuming that "claims" are special roles like read permission, write permission and execute permissions
 * You could have your own implementation of "claims".
 */
//API endpoint Router for "claims" or "permissions" or "role" based actions
app.use('/api/permissions', permissionsRouter)

//Initialize MongoDB
dbConnection();

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});