import { changeStatus, getAllOrderData, getRecentOrders, getUserOrders, lastMonthIncome, lastMonthOrders, OrderDetail, pandingOrders, PlaceOrder, verifyOrder } from "../controllers/order.controller.js";
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
order.route('/order-detail').post(OrderDetail)
order.route('/verify').post(verifyOrder)
order.route('/userorders').post(verifyJWT,getUserOrders)

export default order