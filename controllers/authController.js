import User from "../models/User.js"
import {StatusCodes} from 'http-status-codes'

const register = async (req,res) => {
    //using express-async-errors we can skip try/catch and the error will be passed to errorHandlerMiddleware
    const user = await User.create(req.body)

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({
        user:{
            email: user.email
            ,lastName: user.lastName
            ,location: user.location
            ,name: user.name
        }
        , token
        , location: user.location
    })
}

const login = async (req,res) => {
    res.send("login user")
}

const updateUser = async (req,res) => {
    res.send("update user")
}

export  {register, login, updateUser}