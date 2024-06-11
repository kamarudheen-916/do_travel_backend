import express from "express";
const userAuthRouter = express.Router() 
import { localVariables } from "../middleware/localVariables";
import { uController } from "../utils/dependencyController";

userAuthRouter.post('/signup_user',localVariables,(req,res)=>uController.signUpUser(req,res))
userAuthRouter.post('/signup_property',(req,res)=>uController.signUpProperty(req,res));
userAuthRouter.post('/verifyOTP/:userId',(req,res)=>uController.verifyOTP(req,res))
userAuthRouter.post('/login',(req,res)=>uController.loginUser(req,res))
userAuthRouter.post('/forgottenPassword',(req,res)=>uController.forgottenPass(req,res))
userAuthRouter.post('/verifyForgetOTP',(req,res)=>uController.verifyForgottenOTP(req,res))
userAuthRouter.post('/ResendOtp/:userType/:email', (req, res) => uController.resendOTP(req, res));

export default userAuthRouter