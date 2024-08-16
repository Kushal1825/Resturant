import { User } from "../models/user.model.js";
import {assyncHandler} from '../utils/asyncHandler.js';
import ApiResonse from "../utils/ApiRespnse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

const RegisterUser = assyncHandler(async(req,res)=>{
    const {email,username,password}=req.body
    if(
        [email,username,password].some((field)=>field.trim() == "")
    ){
        throw new ApiError(400,"All field are compolsory")
    }
    
    const existedUser = await User.findOne({email})
    console.log(existedUser)
    if(existedUser){
        throw new ApiError(409,"User already Exist");
    }
    
    const user = await User.create({
        username,
        email,
        password,
    })
    const createdUser = await User.findById(user._id).select(
        "-password"
    );
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user");
    }

    return res.status(200)
    .json(new ApiResonse(200,createdUser,"user registered successfully"))
})


const listUser = assyncHandler(async(req,res)=>{
    const userlist = await User.find({}).select("-password")
    
    res.status(200)
    .json(new ApiResonse(200,userlist,"data fetched successfully"))
    
})






export {RegisterUser,listUser}