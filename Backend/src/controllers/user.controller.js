import { User } from '../models/User.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const signup = async (req, res) => {
    // get data from req
    // check validity of data
    // password hash
    // check user unique from db
    // add user
    // todo: 
    try {
        const {username, email, password} = req.body;
        console.log("Request body:", req.body);
        if(!username || !email || !password){
            const error = new Error("send all credentials of user")
            error.status = 400
            throw error
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
    
        const user = await User.findOne({
            $or: [{ username }, { email }]
        })
    
        if(user){
            const error = new Error("username or email already exist")
            error.status = 400
            throw error
        }

        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword
        })
    
        const token = jwt.sign(
            {userId: createdUser._id.toString()},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
        )
        if(!createdUser){
            const error = new Error("error while creating user")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: "Signup successful", token
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    // get data from req
    // validate data
    // find user
    // compare password
    // token update

    try {
        const {email, password} = req.body
    
        if(!email || !password){
            const error = new Error("send all credentials of user")
            error.status = 400
            throw error
        }
    
        const user = await User.findOne({email})
        if(!user){
            const error = new Error("user not found")
            error.status = 404
            throw error
        }
    
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            const error = new Error("wrong password")
            error.status = 400
            throw error
        }
    
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )
    
        return res.status(200).json({
            message: "Login successful", token 
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

export {signup, login}