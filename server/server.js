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
const allowedOrigins =["http://localhost:5173"

     "https://mern-auth-murex-psi.vercel.app"
]

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
