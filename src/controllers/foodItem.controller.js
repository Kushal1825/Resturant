import { FoodItem } from "../models/foodItem.model.js";

import {assyncHandler} from '../utils/asyncHandler.js';
import ApiResponse from "../utils/ApiRespnse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

const addFood = assyncHandler(async (req,res)=>{
    
    let image_localpath = req.file.path;
    console.log(req.file.path)
    if(!image_localpath){
        throw new ApiError(400,"local path not found")
    }
    let image_filename= await uploadOnCloudinary(image_localpath)
    if(!image_filename){
        throw new ApiError(400,"image is not uploaded properly please try again")
    }
    const food = new FoodItem({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try {
        await food.save();
        res.json({success:true,message:"food added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"});
    }

})

const listFoods =assyncHandler(async (req,res)=>{
    try {
        const response = await FoodItem.find({})
        if(!response){
            throw new ApiError(400,"NO data found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200,response,"Food item fetch successfully"))
    } catch (error) {
        throw new ApiError(400,"NO data found")
    }
})

const DeleteFoodItem = assyncHandler(async(req,res)=>{
    try {
        const food = await FoodItem.findById(req.body.id);

        
        if(!food){
            throw new ApiError(404,"Food is not awailable")
        }
        await FoodItem.findByIdAndDelete(req.body.id);
        
        res
        .status(200)
        .json({
            success:true,
            message:"Food item deleted Succesfully"
        })
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
})

const updateFoodItem = assyncHandler(async(req,res)=>{
     console.log(req.body);
     
    await FoodItem.findByIdAndUpdate(req.body._id,
        {
          $set : {
            name:req.body.name,
            price:req.body.price,
            category:req.body.category,
            description:req.body.description
          },
          
        },
        {
          new:true
        }
    )
    try {
        res.status(200)
        .json(new ApiResponse(200,{},"Data updated successfully"))
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"});
    }
})

const getSingleFoodItem = assyncHandler(async(req,res)=>{
    try {
        const food = await FoodItem.findById(req.body.id);
        
        if(!food){
            throw new ApiError(404,"Food is not awailable")
        }
        
        res
        .status(200)
        .json(
            new ApiResponse(200,food)
        )
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
})


export {
    addFood,
    listFoods,
    DeleteFoodItem,
    getSingleFoodItem,
    updateFoodItem
    }