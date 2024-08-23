import mongoose,{Schema} from "mongoose";

const orderItemSchema = new Schema({
    Order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    foodItem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodItem',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
},{timestamps:true})

export const OrderItem = mongoose.model('OrderItem',orderItemSchema)