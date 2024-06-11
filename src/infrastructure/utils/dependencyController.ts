
import UserController from "../../controller/userController";
import UserUseCase from "../../useCase/UserUseCase";
import hashPassword from "../utils/hashPassword";
import JwtTocken from "../utils/jwt";
import UserRepository from "../repository/userRepository";
import Cloudinary from "../utils/cloudinary";
import GenerateOTP from "../utils/otpGenerate";
import SendMail from "../utils/sendMail";
import PostRepository from "../repository/postRepository";
import propertyController from "../../controller/propertyContrller";
import RoomRepository from "../repository/roomRepository";
import FollowController from "../../controller/followController";
import FollowUseCase from "../../useCase/FollowUseCase";
import FollowRepository from "../repository/followRepository";
import BookingController from "../../controller/bookingController";
import BookingUseCase from "../../useCase/bookingUseCase";
import BookingRepository from "../repository/BookingRepository";
import ChatRepository from "../repository/ChatRepository";
import ChatUserCase from "../../useCase/ChatUserCase";
import ChatController from "../../controller/chatController";

const cloudinary = new Cloudinary()
const generateOTP = new GenerateOTP()
const sendEmail = new SendMail()
const Jwt = new JwtTocken()
const hashPass = new hashPassword() 


const userRepository = new UserRepository()
const postRepository = new PostRepository()
const roomRepository = new RoomRepository()
const followRepository = new FollowRepository()
const bookingRepository = new BookingRepository()
const ChatRepo= new ChatRepository()


const usercase = new UserUseCase(followRepository,userRepository,postRepository,roomRepository,hashPass,Jwt,cloudinary,generateOTP,sendEmail)
const fUsecase = new FollowUseCase(followRepository,userRepository)
const CUserCase = new ChatUserCase(ChatRepo)
const bUseCase = new BookingUseCase(bookingRepository)

export const followController= new FollowController(fUsecase)
export const bookingController = new BookingController(bUseCase)
export const uController = new UserController(usercase)
export const pController = new propertyController(usercase)
export const cController = new ChatController(CUserCase)