import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase:true,
        trim:true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        unique: true,
        trim:true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: ['customer', 'staff'],
        default: 'customer'
    },
},{timestamps:true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
}
export const User = mongoose.model('User',userSchema)