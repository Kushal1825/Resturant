import express from 'express'
import { addFood, DeleteFoodItem, listFoods } from '../controllers/foodItem.controller.js';
import { upload } from '../middlewares/multer.middleware.js';


const foodRouter = express.Router();



// Image storage Engine

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get('/list',listFoods)
foodRouter.post('/delete',DeleteFoodItem)

export default foodRouter;