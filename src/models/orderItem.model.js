import mongoose,{Schema} from "mongoose";

const orderItemSchema = new Schema({
    foodItem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodItem'
    },
    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    }
},{timestamps:true})

export const OrderItem = mongoose.model('OrderItem',orderItemSchema)