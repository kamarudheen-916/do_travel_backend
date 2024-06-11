import express from "express";
import UserAuth from "../middleware/userAuth";
import {  cController } from "../utils/dependencyController";
const chatRouter = express.Router() 


chatRouter.get("/getMessage/:id", UserAuth,(req,res)=>cController.getMessages(req,res))
chatRouter.post('/sendMessage/:id',UserAuth,(req,res)=>cController.sendMessage(req,res))
chatRouter.get("/getUsersSideBar", UserAuth,(req,res)=> cController.getUsersForSidebar(req,res));

export default chatRouter