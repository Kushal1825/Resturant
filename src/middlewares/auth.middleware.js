import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { assyncHandler } from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken'

export const verifyJWT = assyncHandler(
    async(req,res,next)=>{
       try {
         const token = req.cookies?.restaurantAccessToken || req.header("Authorization")?.replace("Bearer ","")
        //  console.log(token);
         
         if(!token){
             throw new ApiError(401,"Unauthorized requrest")
         }
         const decodedToken =jwt.verify(token,process.env.JWT_SECRET)
        //  console.log(decodedToken);
         
         const user = await User.findById(decodedToken._id).select("-password -token")
        //  console.log(user);
         
         if(!user){
             throw new ApiError(401,"Invalid Access Token");
         }
         req.user = user;
         
         return next();
       } catch (error) {
            throw new ApiError(401,"Hello world" || "Invalid access token")
       }

    }  
) 
