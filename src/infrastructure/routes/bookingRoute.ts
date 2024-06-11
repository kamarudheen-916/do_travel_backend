import express from "express";
import UserAuth from "../middleware/userAuth";
import { bookingController } from "../utils/dependencyController";
const bookingRouter = express.Router() 


bookingRouter.get('/checkRoomAvailability',UserAuth,(req,res)=>bookingController.checkRoomAvailability(req,res))
bookingRouter.post('/confirmBooking',UserAuth,(req,res)=>bookingController.confirmBooking(req,res))
bookingRouter.post('/onlinePayment',UserAuth,(req,res)=>bookingController.onlinePayment(req,res))
bookingRouter.get('/fetchAllBookings',UserAuth,(req,res)=>bookingController.fetchAllBookings(req,res))
bookingRouter.put('/cancelBookings',UserAuth,(req,res)=>bookingController.cancelBookings(req,res))

export default bookingRouter