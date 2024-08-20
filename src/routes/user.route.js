import { Router } from "express";
import { listUser, loginUser, logoutUser, RegisterUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const user = Router();

user.route('/signup').post(RegisterUser)
user.route('/user-list').get(listUser)
user.route('/login').post(loginUser)
user.route('/logout').post(verifyJWT , logoutUser)

export default user