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
              },
              createdAt:{
                $push:"$createdAt"
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
              },
              createdAt:{
                $first:"$createdAt"
              }
            }
          },
          {
            $sort: {
              "createdAt": -1
            }
          }     
        ])
          
            res.status(200)
            .json(new ApiResonse(200,data,"data fatched successfully"))
          
          
    } catch (error) {
        throw new ApiError(400,error.message);
    }
      
})

const getRecentOrders = assyncHandler(async (req,res)=>{
  try {
      const data = await Order.aggregate([

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
            },
            createdAt:{
              $push:"$createdAt"
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
            },
            createdAt:{
              $first:"$createdAt"
            }
          }
        },
        {
          $sort: {
            "createdAt": -1
          }
        },
        {
          $limit:2
        }
            
      ])
        
          res.status(200)
          .json(new ApiResonse(200,data,"data fatched successfully"))
        
        
  } catch (error) {
      throw new ApiError(400,error.message);
  }
    
})

const changeStatus = assyncHandler(async (req,res)=>{
  await Order.findByIdAndUpdate(req.body._id,{
    $set:{
      status:req.body.status
    }
  },
  {
    $new:true
  }
  )
  res.status(200)
  .json(new ApiResonse(200,{},"Data Updated Successfully"))
})

const lastMonthIncome = assyncHandler(async (req,res)=>{
  const income = await Order.aggregate([
    [
      {
          $match: {
            status: "Delivered",
            createdAt: {
              $gt: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: "$totalAmount",
            },
          },
        },
        {
          $project: {
            _id: 0,
            number: 0,
          },
        },
    ]
  ])
  res.status(200)
  .json(new ApiResonse(200,income,"Last 30 day income is fetched successfully"))

})

const lastMonthOrders = assyncHandler(async(req,res)=>{
  const orders = await Order.aggregate([
    {
      $match: {
        createdAt:{$gt:new Date(Date.now() - 30*24*60*60 * 1000)}
      }
    },
    {
      $count: 'orders'
    }
  ]);
  res.status(200)
  .json(new ApiResonse(200,orders,"Total Number of last month order"))
})

const pandingOrders = assyncHandler(async(req,res)=>{
  const orders = await Order.aggregate([
    {
      $match: {
        status:"Pending",
        createdAt:{$gt:new Date(Date.now() - 30*24*60*60 * 1000)}
      }
    },
    {
      $count: 'orders'
    }
  ]);
  res.status(200)
  .json(new ApiResonse(200,orders,"Total Number of last month order"))
})

export {PlaceOrder,getAllOrderData,getRecentOrders,changeStatus,lastMonthIncome,lastMonthOrders,pandingOrders}