import { User } from "../models/user.model.js";
import {assyncHandler} from '../utils/asyncHandler.js';
import ApiResonse from "../utils/ApiRespnse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


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
    
    const token = jwt.sign(
        {_id:user._id,email},
        process.env.JWT_SECRET,
        {expiresIn:"2d"}
    )
    user.token = token;
    await user.save();
   
    const createdUser = await User.findById(user._id).select(
        "-password"
    );
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user");
    }

    return res.status(200)
    .json(new ApiResonse(200,createdUser,"user registered successfully"))
})

const loginUser = assyncHandler(async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!(email && password)){
            res.status(400)
            .json(new ApiError(400,"Please enter the data"))
        }
        const user = await User.findOne({email})
        if(!user){
            res.status(400)
            .json(new ApiError(400,"Please register first"))
        }
        if(user && ( await user.isPasswordCorrect(password) )){

            const token = jwt.sign(
                {_id:user._id},
                process.env.JWT_SECRET,
                {expiresIn:"2d"}
            );

            user.token = token
            user.password=""
            //send token in cookie parser
            
            const options = {
                expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                // secure:true,

            }

            res.status(200)
            .cookie("restaurantAccessToken",token,options)
            .json(new ApiResonse(200,{user:user,token}))
        }
    } catch (error) {
        console.log(error);
        
    }
})

const logoutUser = assyncHandler(async(req,res)=>{
    try {
        console.log("Hello here");
        
        await User.findByIdAndUpdate(req.user._id,
            {
              $set : {
                token : ""
              },
              
            },
            {
              new:true
            }
            )
        const options = {
            expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true
        }
        // console.log("hello here");
        
    return res
    .status(200)
    .clearCookie("restaurantAccessToken",options)
    .json(new ApiResonse(200,{},"User loggedout"))
    
    } catch (error) {
        console.log(error.message);
        
    }
})

const listUser = assyncHandler(async(req,res)=>{
    const userlist = await User.find({}).select("-password")
    
    res.status(200)
    .json(new ApiResonse(200,userlist,"data fetched successfully"))
    
})

const removeUser= assyncHandler(async (req,res)=>{
    try {
        const user = await User.findById(req.body.id);

        if(!user){
            throw new ApiError(404,"User is not awailable")
        }
        await User.findByIdAndDelete(req.body.id);
        
        res
        .status(200)
        .json({
            success:true,
            message:"user deleted Succesfully"
        })
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
})

export {RegisterUser,listUser,loginUser,logoutUser,removeUser}