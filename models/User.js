import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs'

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

export default mongoose.model('User', UserSchema)