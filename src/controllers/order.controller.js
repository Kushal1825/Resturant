import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResonse from "../utils/ApiRespnse.js";
import { assyncHandler } from "../utils/asyncHandler.js";


const PlaceOrder = assyncHandler(async(req,res)=>{
    try {
        
        const {totalAmount,orderItems}=req.body;
        
        if(totalAmount==0){
            throw new ApiError(400,"Please Select the data and send the totalAmount")
        }
        // console.log(totalAmount,orderItems);

        const order= await Order.create(
            {
                user:req.user.id,
                totalAmount:totalAmount
            }
        );

        // console.log(order);
        
        

        const createdOrderItems = await Promise.all(
            orderItems.map(item => {
                console.log(item);
                
                const orderItem = new OrderItem({
                    order: order._id,
                    foodItem: item.foodItem,
                    quantity: item.quantity
                });
                return orderItem.save();
            })
        );  
        // console.log(createdOrderItems);

        order.orderItems = createdOrderItems.map(orderItem => orderItem._id);
        await order.save();

        res.status(200)
        .json(new ApiResonse(200,{order},"Order Placed successfully"))
    } catch (error) {
        throw new ApiError(400,error.message)
    }
})

const getAllOrderData = assyncHandler(async (req,res)=>{
    try {
        const data = await Order.aggregate([
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $addFields: {
              user: {
                $first:"$user"
              }
            }
          },
          {
            $unwind: "$orderItems"
          },
          {
            $lookup: {
              from: "orderitems",
              localField: "orderItems",
              foreignField: "_id",
              as: "orderItems",
              pipeline:[
                {
                  $lookup:{
                    from:"fooditems",
                    localField:"foodItem",
                    foreignField:"_id",
                    as:"foodItem"
                  }
                },
                {
                  $addFields:{
                    "foodItem":{
                      $first:'$foodItem'
                    }
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              orderItems:{
                $first:"$orderItems"
              }
            }
          },
          {
            $group: {
              "_id":"$_id",
              orderItems:{$push:"$orderItems"},
              totalAmount:{
              $push:"$totalAmount"
              },
              user:{
              $push:"$user"
              },
              status:{
                $push:"$status"
              }
            }
            
          },
          {
            $addFields: {
              totalAmount:{
                $first:"$totalAmount"
              },
              user:{
                $first:"$user"
              },
              status:{
                $first:"$status"
              }
            }
          }
        
        ])
          
            res.status(200)
            .json(new ApiResonse(200,data,"data fatched successfully"))
          
          
    } catch (error) {
        throw new ApiError(400,error.message);
    }
      
})

export {PlaceOrder,getAllOrderData}