import express from "express";
import { userProfileUpload,propertyUpload } from "../middleware/multer";
import UserController from "../../controller/userController";
import UserUseCase from "../../useCase/UserUseCase";
import hashPassword from "../utils/hashPassword";
import JwtTocken from "../utils/jwt";
import UserRepository from "../repository/userRepository";
import Cloudinary from "../utils/cloudinary";
import GenerateOTP from "../utils/otpGenerate";
import SendMail from "../utils/sendMail";
import { localVariables } from "../middleware/auth";
const router = express.Router() 
const cloudinary = new Cloudinary()
const generateOTP = new GenerateOTP()
const sendEmail = new SendMail()
const Jwt = new JwtTocken()
const hashPass = new hashPassword()
const userRepository = new UserRepository()
const usercase = new UserUseCase(userRepository,hashPass,Jwt,cloudinary,generateOTP,sendEmail)
const uController = new UserController(usercase)


router.post('/signup_user',localVariables,(req,res)=>uController.signUpUser(req,res))
router.post('/signup_property',(req,res)=>uController.signUpProperty(req,res));
router.post('/verifyOTP/:userId',(req,res)=>uController.verifyOTP(req,res))
router.post('/login',(req,res)=>uController.loginUser(req,res))
router.post('/forgottenPassword',(req,res)=>uController.forgottenPass(req,res))
router.post('/verifyForgetOTP',(req,res)=>uController.verifyForgottenOTP(req,res))
router.post('/ResendOtp/:userType/:email', (req, res) => uController.resendOTP(req, res));


export default router  