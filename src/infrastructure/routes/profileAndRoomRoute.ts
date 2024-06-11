import express from "express";
import UserAuth from "../middleware/userAuth";
import { pController, uController } from "../utils/dependencyController";
import PropertyAuth from "../middleware/propertyAuth";
const porfileAndRoomRouter = express.Router() 

//to get user profile data for editing purpose (for both normal user and property user )
porfileAndRoomRouter.get('/getUserData',UserAuth,(req,res)=>uController.getUserData(req,res))
//to update the user profile data (for both normal user and property user )
porfileAndRoomRouter.put('/updateUserData',UserAuth,(req,res)=>uController.updateUserData(req,res))

porfileAndRoomRouter.put('/uploadImg',UserAuth,(req,res)=>uController.uploadImg(req,res))
porfileAndRoomRouter.post('/propertyCreate',PropertyAuth,(req,res)=>pController.propertyCreate(req,res))
porfileAndRoomRouter.post('/addRoom',PropertyAuth,(req,res)=>pController.addRoom(req,res))
porfileAndRoomRouter.put('/editRoom',PropertyAuth,(req,res)=>pController.editRoom(req,res))
porfileAndRoomRouter.get('/fetchRoomData',PropertyAuth,(req,res)=>pController.fetchRoomData(req,res))
porfileAndRoomRouter.get('/fetchOtherProfileRoomData',UserAuth,(req,res)=>pController.fetchOtherProfileRoomData(req,res))
porfileAndRoomRouter.delete('/deleteRoom',UserAuth,(req,res)=>pController.deleteRoom(req,res))
porfileAndRoomRouter.put('/updateRoomRating',UserAuth,(req,res)=>uController.updateRating(req,res))


export default porfileAndRoomRouter