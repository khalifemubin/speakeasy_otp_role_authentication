import User from "../models/User.js";
import speakeasy from "speakeasy";
import dotenv from "dotenv";

dotenv.config();

/**
 * Endpoint to generate OTP
 * @param {*} req 
 * @param {*} res 
 * @returns speakeasy OTP url for authentication
 */
export const generateOtp = async (req, res) => {
    //Read user id from request token
    const userId = req.user.id;

    try {
        //Check if the user id exists
        const user = await User.findById(userId);

        if (!user) {
            //If it doesn't send error response
            return res.status(404).json({ message: 'User not found' });
        }

        //generate speakeasy OTP auth url
        const otpAuthUrl = speakeasy.otpauthURL({
            secret: user.secret, //secret was stored in the user's document during registration
            label: `TestLabel:${user.username}`, //Dummy Text. Change it based on organization
            algorithm: 'sha512' //Choose your own algorithm for encoding the url
        });

        //Return the generated URL
        res.json({ otpAuthUrl });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * API Endpoint to verify OTP
 * @param {*} req -> This will contain OTP token manually entered by client (obtained from authenticator like Google Authenticator)
 * @param {*} res 
 * @returns verification message based on OTP token
 */
export const verifyOtp = async (req, res) => {
    //Read user id from request token
    const userId = req.user.id;
    //Extract token code entered by user
    const token = req.body.token;

    try {
        //Check if the user id exists
        const user = await User.findById(userId);

        if (!user) {
            //If it doesn't send error response
            return res.status(404).json({ message: 'User not found' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token,
        });

        if (verified) {
            //success
            res.json({ message: 'OTP verified successfully' });
        } else {
            //invalid otp
            res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * API endpoint for simulating/testing Google Authenticator like client, which generates time bound valid OTP token code
 * @param {*} req 
 * @param {*} res 
 * @returns the dynamic token code set by speakeasy
 */
export const simulateToken = async (req, res) => {

    const userId = req.user.id;

    try {
        //Check if the user id exists
        const user = await User.findById(userId);

        if (!user) {
            //If it doesn't send error response
            return res.status(404).json({ message: 'User not found' });
        }

        //Generate token code for this user
        const token = speakeasy.totp({
            secret: user.secret,
            encoding: 'base32'
        });

        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}