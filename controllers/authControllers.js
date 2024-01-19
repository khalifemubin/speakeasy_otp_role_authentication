import User from "../models/User.js";
import speakeasy from "speakeasy";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Registration endpoint
 * @param {*} req 
 * @param {*} res 
 * @returns json success message
 */
export const registerUser = async (req, res) => {
    //Destructure request for username, password and claims
    //Here claims will be a JSON string containing array of "claims"
    const { username, password, claims } = req.body;

    try {
        //Check if the user exists already
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            //If it does, send error response
            return res.status(409).json({ message: 'Username already exists' });
        }

        //Get array from "claims" parameter
        const permissions = JSON.parse(claims);

        //Hash the password and store it in DB
        const hashedPassword = await bcrypt.hash(password, 10);

        //Generate speckeasy secret for the user
        const secret = speakeasy.generateSecret().base32;

        //Insert document into users collection
        const newUser = new User({
            username,
            password: hashedPassword,
            secret,
            claims: permissions, // Default claim for a new user
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * Login endpoint
 * @param {*} req 
 * @param {*} res 
 * @returns token in json along with success message
 */
export const loginUser = async (req, res) => {
    //Destructure request for username and password
    const { username, password } = req.body;

    try {
        //Check if the username exists
        const user = await User.findOne({ username });

        if (!user) {
            //If it doesn't send error response
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //Hash the password parameter and compare it with DB record
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            //If the passwords don;t match then send the error response
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Payload for JWT token
        const payload = {
            user: {
                id: user._id,
            },
        };

        // Sign the token
        const authToken = jwt.sign(payload, process.env.JWT_SECRET);

        res.json({ message: 'Login successful', authToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}