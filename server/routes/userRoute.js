import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userControllers.js";

const userRouter = express.Router();

// Protect the route with the userAuth middleware
userRouter.get("/data", userAuth, getUserData);

export default userRouter;
