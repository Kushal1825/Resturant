import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const orderSchema = new Schema ({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderItem"
    }],
    totalAmount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['Pending','Confirmed','Cancel','Delivered'],
        default:'Pending'
    }
},{timestamps:true})

orderSchema.plugin(mongooseAggregatePaginate)

export const Order =mongoose.model('Order',orderSchema);
