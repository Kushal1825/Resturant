import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:'100kb'})) // data send by json file 

app.use(express.urlencoded({extended:true,limit:"16kb"})) // data send by url middleware
app.use(express.static("public"))
app.use(cookieParser()) //cookie fetch or set middleware using cookie parser

export { app }