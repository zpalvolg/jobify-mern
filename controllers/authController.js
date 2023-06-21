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
    const {email, password } = req.body
    
    if (!email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Provide all values!"
        })
    } else{

        const user = await User.findOne({email}).select('+password')

        if (!user){
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: "Invalid Credentials!"
            })
        } else {
            const isPasswordCorret = await user.comparePassword(password)

            if (!isPasswordCorret){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    msg: "Invalid Credentials!"
                })
            } else{
                //generate new token
                const token = user.createJWT()

                //hide password in response
                user.password = undefined

                res.status(StatusCodes.OK).json({
                    user
                    , token
                    , location: user.location,
                })
            }
        }
    }
}

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body;
    
    if (!email || !name || !lastName || !location) {
        res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Provide all values!"
        })
    } else {
        const user = await User.findOne({ _id: req.user.userId });
    
        user.email = email;
        user.name = name;
        user.lastName = lastName;
        user.location = location;
    
        await user.save();
    
        // various setups
        // in this case only id
        // if other properties included, must re-generate
    
        const token = user.createJWT();
        
        res.status(StatusCodes.OK).json({
            user
            , token
            , location: user.location,
        });
    }
  };

export  {register, login, updateUser}