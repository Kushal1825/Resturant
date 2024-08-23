import { getAllOrderData, PlaceOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const order = new Router();

order.route("/place-order").post(verifyJWT,PlaceOrder);
order.route("/list").get(getAllOrderData)

export default order