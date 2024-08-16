import { Router } from "express";
import { listUser, RegisterUser } from "../controllers/user.controller.js";

const user = Router();

user.route('/signup').post(RegisterUser)
user.route('/user-list').get(listUser)

export default user