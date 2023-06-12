import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name: {
        type: String
        , required:[true, 'Please provide name!']
        , minlenght: 3
        , maxlenght: 20
        , trim: true
    }
    ,email: {
        type: String
        , required:[true, 'Please provide email!']
        , validate:{
            validator:validator.isEmail
            ,message:'Please provide valid email!'
        }
        , unique: true
    }
    ,password: {
        type: String
        , required:[true, 'Please provide password!']
        , minlenght: 6
        , select:false
    }
    ,lastName: {
        type: String
        , trim: true
        , maxlenght: 20
        , default: 'Lastname'
    }
    ,location: {
        type: String
        , trim: true
        , maxlenght: 20
        , default: 'My City'
    }       
})

//Mongoose middleware 
//pre-process before save
UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//create custom method
UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model('User', UserSchema)