import mongoose from "mongoose";

//User model schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    secret: String,
    claims: [String],//I am using array, the implementation is open for you to modify it for your use case
});

const User = mongoose.model('User', userSchema);
export default User;