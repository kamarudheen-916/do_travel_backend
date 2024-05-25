import express from "express";
import AdminController from "../../controller/adminController";
import AdminUseCase from "../../useCase/adminUseCase";
import AdminRepository from "../repository/AdminReopository";
import JwtTocken from "../utils/jwt";
import adminAuth from "../middleware/adminAuth";
import UserUseCase from "../../useCase/UserUseCase";
import Cloudinary from "../utils/cloudinary";
import GenerateOTP from "../utils/otpGenerate";
import SendMail from "../utils/sendMail";
import hashPassword from "../utils/hashPassword";
import UserRepository from "../repository/userRepository";
import PostRepository from "../repository/postRepository";
import RoomRepository from "../repository/roomRepository";
import FollowRepository from "../repository/followRepository";
const adminRouter = express.Router() 



const Jwt = new JwtTocken()

const bookingRepository = new AdminRepository()
const bUseCase = new AdminUseCase(bookingRepository,Jwt)
const cloudinary = new Cloudinary()
const generateOTP = new GenerateOTP()
const sendEmail = new SendMail()

const hashPass = new hashPassword() 
const userRepository = new UserRepository()
const postRepository = new PostRepository()
const roomRepository = new RoomRepository()
const followRepository = new FollowRepository()
const usercase = new UserUseCase(followRepository,userRepository,postRepository,roomRepository,hashPass,Jwt,cloudinary,generateOTP,sendEmail)
const adminController = new AdminController(bUseCase,usercase)


adminRouter.post('/adminlogin',(req,res)=>adminController.adminLogin(req,res))
adminRouter.get('/fetchDashBoardCount',adminAuth,(req,res)=>adminController.fetchDashBoardCount(req,res))
adminRouter.get('/fetchDashBoardGraphData',adminAuth,(req,res)=>adminController.fetchDashBoardGraphData(req,res))

adminRouter.get('/fetchAllUserData',adminAuth,(req,res)=>adminController.fetchAllUserData(req,res))
adminRouter.get('/getUserData',adminAuth,(req,res)=>adminController.getUserData(req,res))
adminRouter.put('/updateUserData',adminAuth,(req,res)=>adminController.updateUserData(req,res))

adminRouter.put('/uploadImg',adminAuth,(req,res)=>adminController.uploadImg(req,res))
adminRouter.put('/handleBlockOrUnblock',adminAuth,(req,res)=>adminController.handleBlockOrUnblock(req,res))
adminRouter.get('/fetchAllBookingData',adminAuth,(req,res)=>adminController.fetchAllBookingData(req,res))

adminRouter.get('/fetchAllPostReportData',adminAuth,(req,res)=>adminController.fetchAllPostReportData(req,res))
adminRouter.get('/findUserPostById',adminAuth,(req,res)=>adminController.findUserPostById(req,res))
adminRouter.delete('/adminDeletePost',adminAuth,(req,res)=>adminController.adminDeletePost(req,res))






export default adminRouter