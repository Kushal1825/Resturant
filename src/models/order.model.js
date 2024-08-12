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
        enum:['Pending','confirmed','ready','served'],
        default:'pending'
    },
    tableNumber:{
        type:Number,
        required:true,
    }
},{timestamps:true})

orderSchema.plugin(mongooseAggregatePaginate)

export const Order =mongoose.model('Order',orderSchema);
