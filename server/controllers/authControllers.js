import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";


export const register=async (req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email ||!password){
        return res.json({success:false,message:"Missing Details"});

    }

    try {

        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"User Already Exists with this Email"});
        }
        const hashedPassword=await bcrypt.hash(password,8);
        const user=new userModel({name,email,password:hashedPassword});

        await user.save();

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        });
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            sameSite:process.env.NODE_ENV == "production" ? "none" : "strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        });
          // Sending welcome email
        const mailOptions ={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to Ravi Soft tech",
            text:` Welcome to Ravi Softech website.Your account has been created successfully with
             email id: ${email}`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success:true, message:"Register successfull"});



        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}



export const login=async (req,res)=>{
    const {email,password}= req.body;

    if(!email || !password){
        return res.json({success:false,message:"Email and Password are required"})
    }

    try {
          
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"Invalid Email"});

        }

        

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false, message:"Invalid Password"});
        }


        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        });
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            sameSite:process.env.NODE_ENV == "production" ? "none" : "strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true, message:"Login successfull"});





    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


export const logout=async (req,res)=>{
    try {
        res.clearCookie("token",{
            
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            sameSite:process.env.NODE_ENV == "production" ? "none" : "strict"


        })
        return res.json({success:true,message:"Logged Out"});
    } 
    catch (error) {

        return res.json({success:false,message:error.message})
    }
}
// send verification otp the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
      const userId = req.userId;
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      if (user.isAccountVerified) {
        return res.json({ success: false, message: "Account Already Verified" });
      }
  
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
      
      // Ensure OTP is being saved
      await user.save();
      console.log("OTP Saved in DB:", user.verifyOtp); // Debug: Confirm OTP is saved in DB
  
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account Verification OTP",
        // text: `Your OTP is ${otp}. Verify your account using this OTP.`
        
        html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
      };
  
      await transporter.sendMail(mailOption);
  
      return res.json({ success: true, message: "Verification OTP Sent to your Email" });
  
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  // verify user's email using OTP
  export const verifyEmail = async (req, res) => {
    const userId = req.userId; // from token
    const { otp } = req.body;
  
    if (!userId || !otp) {
      return res.json({ success: false, message: "Invalid OTP or User ID" });
    }
  
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.json({ success: false, message: "User Not Found" });
      }
  
      console.log("Entered OTP:", otp.trim());
      console.log("Stored OTP:", user.verifyOtp); // Check what value is stored in DB
  
      if (!user.verifyOtp || user.verifyOtp !== otp.trim()) {
        return res.json({ success: false, message: "Invalid OTP" });
      }
  
      if (user.verifyOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP Expired" });
      }
  
      user.isAccountVerified = true;
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
      await user.save();
  
      return res.json({ success: true, message: "Email Verified Successfully" });
  
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

// check if user is authenticated

  export const isAuthenticated = async (req,res)=>{
    try {
      return res.json({ success: true, message: "User is authenticated" });
      
    } catch (error) {
       res.json({ success: false, message: error.message });
      
    }
  }


  // send password reset otp

  export const sendResetOtp = async (req,res)=>{
    const {email} =req.body;

    if(!email){
      return res.json({ success: false, message: "Email is required" });
    }

    try {

      const user =await userModel.findOne({email});

      if(!user){
        return res.json({ success: false, message: "User not found" });
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.resetOtp = otp;
      user.resetOtpExpireAt = Date.now() + 15 * 60  * 1000;
      
      // Ensure OTP is being saved
      await user.save();
      console.log("OTP Saved in DB:", user.resetOtp); // Debug: Confirm OTP is saved in DB
  
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password reset OTP",
        // text: `Your OTP  for resetting the password is ${otp}. Use this otp to reset your password.`,
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
      };
      await transporter.sendMail(mailOption);
      return res.json({ success: true, message: "OTP sent to your email" });

      
    } catch (error) {
      res.json({success:false, message:error.message});
    }
    
  }


  // Reset user password

  export  const resetPassword = async (req,res)=>{
    const {email,otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
      return res.json({success:false, message:"Email, otp and newPassword are required"});
    
  }
  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success:false, message:"User not found"});
    }

    if(user.resetOtp === "" || user.resetOtp !== otp){
      return res.json({success:false, message:"Invalid OTP"});
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success:false, message:"OTP has expired"});
    }
    const hashedPassword = await bcrypt.hash(newPassword,  8);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    res.json({success:true, message:"Password  has been reset successfully"});
    
  } catch (error) {
    res.json({success:false, message:error.message});
    
  }
}