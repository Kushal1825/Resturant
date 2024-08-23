// require('dotenv').config({path:"./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
import foodRouter from "./routes/foodItem.route.js";
import user from "./routes/user.route.js";
import order from "./routes/order.route.js";
dotenv.config({path:"./env"})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGODB db connection Failed !! ", err);
})


app.use("/api/foodItem",foodRouter)

app.use('/api/user',user)

app.use('/api/order',order)








