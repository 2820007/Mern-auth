import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";


const app=express();


const port=process.env.PORT || 3000
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true
  }));
  


//Api endpoints
app.get("/",(req,res)=>{
    res.send("Api working");
});

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);


app.listen(port, ()=>
    console.log(`server started on PORT :${port}`));
