import { changeStatus, getAllOrderData, getRecentOrders, lastMonthIncome, lastMonthOrders, pandingOrders, PlaceOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const order = new Router();

order.route("/place-order").post(verifyJWT,PlaceOrder);
order.route("/list").get(getAllOrderData)
order.route("/recent").get(getRecentOrders)
order.route("/update-status").post(changeStatus)
order.route("/lastmonth-income").get(lastMonthIncome)
order.route("/lastmonth-orders").get(lastMonthOrders)
order.route("/panding-orders").get(pandingOrders)

export default order