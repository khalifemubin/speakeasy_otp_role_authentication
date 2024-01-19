import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from '../models/User.js';

dotenv.config();

/**
 * This middleware will check if specific endpoint requested has a cliam value. 
 * This middleware itself uses "authMiddleware" (below) in turn to fetch user's claims/roles/permissions set 
 * while registration
 * @param {*} claims This is fixed for each API endpoint. Could be a combination of one or more values
 * @returns
 */
// Middleware for claim-based authorization
export const authorize = (claims) => {
    return (req, res, next) => {

        //first identify the user based on token. For this we will use "authMiddleware"
        authMiddleware(req, res, async () => {
            //get user id from the token
            const userId = req.user.id;

            //check if the user exists
            const user = await User.findById(userId);

            if (!user) {
                //if it doesn't send error response
                return res.status(404).json({ message: 'User not found' });
            }

            //get the cliams/roles/permissions for this user
            const userClaims = user.claims || [];
            //Here I am being strict, if all of them match
            const hasPermission = claims.every(claim => userClaims.includes(claim));
            //Or if you want to have any single permission matching to the protected enpoint, use below
            // const hasPermission = claims.some(claim => userClaims.includes(claim));

            if (hasPermission) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
            }

        })
    };
}

/**
 * The main middleware for authentication based on token in request header
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const authMiddleware = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // console.log(`token in middlware: ${token}`);

    // If token not present, return with 401 status and a message
    if (!token) {
        // console.log("token not present");
        return res.status(401).json({ msg: 'Not Authorized' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // If token expired, return with 401 status and a message
            return res.status(401).json({ msg: 'Token is invalid/expired' });
        } else {
            // console.log("decoded user is:")
            // console.log(decoded.user);
            req.user = decoded.user;
            next();
        }
    });
};

export default authMiddleware;