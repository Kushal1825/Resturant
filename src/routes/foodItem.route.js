import express from 'express'
import { addFood, DeleteFoodItem, listFoods } from '../controllers/foodItem.controller.js';
import { upload } from '../middlewares/multer.middleware.js';


const foodRouter = express.Router();



// Image storage Engine

foodRouter.route("/add").post(upload.single("image"),addFood)
foodRouter.route("/list").get(listFoods)
foodRouter.route('/delete').post(DeleteFoodItem)

export default foodRouter;