import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { LoginRoute } from "./routes/LoginRoute.js";
import { TravellerRoute } from "./routes/TravellerRoute.js";

//Creating server using express js
const app = express()
dotenv.config()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect(process.env.DATABASE)

const port = process.env.PORT

app.use("/", LoginRoute)
app.use("/traveller", TravellerRoute)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})