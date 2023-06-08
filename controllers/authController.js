import User from "../models/User.js"
import {StatusCodes} from 'http-status-codes'

const register = async (req,res) => {
    //using express-async-errors we can skip try/catch and the error will be passed to errorHandlerMiddleware
    const user = await User.create(req.body)
    res.status(StatusCodes.CREATED).json({user})
}

const login = async (req,res) => {
    res.send("login user")
}

const updateUser = async (req,res) => {
    res.send("update user")
}

export  {register, login, updateUser}