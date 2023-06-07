import mongoose from "mongoose";
import validator from 'validator';

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

export default mongoose.model('User', UserSchema)