import express from 'express'
import { addFood } from '../controllers/food.controller.js'
import { upload } from '../middlewares/multer.middleware.js';


const foodRouter = express.Router();



// Image storage Engine

foodRouter.post("/add",upload.single("image"),addFood)

export default foodRouter;