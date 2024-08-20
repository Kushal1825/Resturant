import mongoose,{Schema} from "mongoose";

const foodItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String, //cloudinary url
        required:true,
    },
    category: {
        type: String,
        enum: ['starter', 'main_course', 'dessert', 'beverage'], // or custom categories
        required:true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
},{timestamps:true});

export const FoodItem = mongoose.models.FoodItem || mongoose.model('FoodItem',foodItemSchema)

