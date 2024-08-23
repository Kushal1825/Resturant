import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    avtar:{
        type:String,
        default: ""
    },
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
    Address:{
        type:String,
        default:""
    },
    role: {
        type: String,
        enum: ['customer','staff',"admin"],
        default: 'customer'
    },
    token:{
        type:String
    }
},{timestamps:true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
}
export const User = mongoose.model('User',userSchema)