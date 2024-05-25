import express from "express";
const router = express.Router() 

import UserAuth from "../middleware/userAuth";
import UserController from "../../controller/userController";
import UserUseCase from "../../useCase/UserUseCase";
import hashPassword from "../utils/hashPassword";
import JwtTocken from "../utils/jwt";
import UserRepository from "../repository/userRepository";
import Cloudinary from "../utils/cloudinary";
import GenerateOTP from "../utils/otpGenerate";
import SendMail from "../utils/sendMail";
import { localVariables } from "../middleware/localVariables";
import PostRepository from "../repository/postRepository";
import PropertyAuth from "../middleware/propertyAuth";
import propertyController from "../../controller/propertyContrller";
import RoomRepository from "../repository/roomRepository";
import FollowController from "../../controller/followController";
import FollowUseCase from "../../useCase/FollowUseCase";
import FollowRepository from "../repository/followRepository";
import BookingController from "../../controller/bookingController";
import BookingUseCase from "../../useCase/bookingUseCase";
import BookingRepository from "../repository/BookingRepository";
const cloudinary = new Cloudinary()
const generateOTP = new GenerateOTP()
const sendEmail = new SendMail()
const Jwt = new JwtTocken()
const hashPass = new hashPassword() 
const userRepository = new UserRepository()
const postRepository = new PostRepository()
const roomRepository = new RoomRepository()
const followRepository = new FollowRepository()
const usercase = new UserUseCase(followRepository,userRepository,postRepository,roomRepository,hashPass,Jwt,cloudinary,generateOTP,sendEmail)
const uController = new UserController(usercase)

const pController = new propertyController(usercase)


const fUsecase = new FollowUseCase(followRepository,userRepository)
const followController= new FollowController(fUsecase)

const bookingRepository = new BookingRepository()
const bUseCase = new BookingUseCase(bookingRepository)
const bookingController = new BookingController(bUseCase)


router.post('/signup_user',localVariables,(req,res)=>uController.signUpUser(req,res))
router.post('/signup_property',(req,res)=>uController.signUpProperty(req,res));
router.post('/verifyOTP/:userId',(req,res)=>uController.verifyOTP(req,res))
router.post('/login',(req,res)=>uController.loginUser(req,res))
router.post('/forgottenPassword',(req,res)=>uController.forgottenPass(req,res))
router.post('/verifyForgetOTP',(req,res)=>uController.verifyForgottenOTP(req,res))
router.post('/ResendOtp/:userType/:email', (req, res) => uController.resendOTP(req, res));
router.post('/userCreate',UserAuth,(req,res)=>uController.userCreate(req,res))
router.get('/getAllFeeds',UserAuth,(req,res)=>uController.getAllFeeds(req,res))
router.get('/getAllPosts',UserAuth,(req,res)=>uController.getAllPosts(req,res))

router.get('/getOthersProfilePosts',UserAuth,(req,res)=>uController.getOthersProfile(req,res))

//to get user profile data for editing purpose (for both normal user and property user )
router.get('/getUserData',UserAuth,(req,res)=>uController.getUserData(req,res))
//to update the user profile data (for both normal user and property user )
router.put('/updateUserData',UserAuth,(req,res)=>uController.updateUserData(req,res))

router.post('/postComment',UserAuth,(req,res)=>uController.postComment(req,res))
router.post('/reportPost',UserAuth,(req,res)=>uController.reportPost(req,res))
router.delete('/deleteComment',UserAuth,(req,res)=>uController.deleteComment(req,res))
router.put('/editComment',UserAuth,(req,res)=>uController.editComment(req,res))
router.put('/updateRoomRating',UserAuth,(req,res)=>uController.updateRating(req,res))
router.put('/saveOrUnSavePost',UserAuth,(req,res)=>uController.saveOrUnSavePost(req,res))
router.get('/isPostSaved',UserAuth,(req,res)=>uController.isPostSaved(req,res))
router.put('/likeOrUnLikePost',UserAuth,(req,res)=>uController.likeOrUnLikePost(req,res))
router.get('/isPostLiked',UserAuth,(req,res)=>uController.isPostLiked(req,res))
router.get('/fetchPostLikersData',UserAuth,(req,res)=>uController.fetchPostLikersData(req,res))
router.delete('/deletePost',UserAuth,(req,res)=>uController.deletePost(req,res))






router.put('/uploadImg',UserAuth,(req,res)=>uController.uploadImg(req,res))
router.post('/propertyCreate',PropertyAuth,(req,res)=>pController.propertyCreate(req,res))
router.post('/addRoom',PropertyAuth,(req,res)=>pController.addRoom(req,res))
router.put('/editRoom',PropertyAuth,(req,res)=>pController.editRoom(req,res))
router.get('/fetchRoomData',PropertyAuth,(req,res)=>pController.fetchRoomData(req,res))
router.get('/fetchOtherProfileRoomData',UserAuth,(req,res)=>pController.fetchOtherProfileRoomData(req,res))
router.delete('/deleteRoom',UserAuth,(req,res)=>pController.deleteRoom(req,res))

router.get('/userSearch',UserAuth,(req,res)=>uController.userSearch(req,res))

router.post('/FollowRequest',UserAuth,(req,res)=>followController.FollowRequest(req,res))
router.put('/unFollowRequest',UserAuth,(req,res)=>followController.unFollowRequest(req,res))
router.get('/checkIsFollwoed',UserAuth,(req,res)=>followController.checkIsFollwoed(req,res))
router.get('/fetchFollwerRequest',UserAuth,(req,res)=>followController.isFollwerRequest(req,res))
router.post('/confirmFollReq',UserAuth,(req,res)=>followController.confirmFollReq(req,res))
router.put('/cancelFollReq',UserAuth,(req,res)=>followController.cancelFollReq(req,res))
router.get('/fetchAllFollowdata',UserAuth,(req,res)=>followController.fetchAllFollowData(req,res))
router.get('/fetchFollowerOriginalData',UserAuth,(req,res)=>followController.fetchFollowerOriginalData(req,res))


router.put('/setThemeMode',UserAuth,(req,res)=>uController.setThemeMode(req,res))
router.get('/getThemeMode',UserAuth,(req,res)=>uController.getThemeMode(req,res))


router.post('/confirmBooking',UserAuth,(req,res)=>bookingController.confirmBooking(req,res))
router.post('/onlinePayment',UserAuth,(req,res)=>bookingController.onlinePayment(req,res))
router.get('/fetchAllBookings',UserAuth,(req,res)=>bookingController.fetchAllBookings(req,res))
router.put('/cancelBookings',UserAuth,(req,res)=>bookingController.cancelBookings(req,res))

router.get("/getMessage/:id", UserAuth,uController.getMessages);
router.post('/sendMessage/:id',UserAuth,(req,res)=>uController.sendMessage(req,res))
router.get("/getUsersSideBar", UserAuth, uController.getUsersForSidebar);

export default router  