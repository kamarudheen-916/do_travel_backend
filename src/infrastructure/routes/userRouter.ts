import express from "express";
import UserAuth from "../middleware/userAuth";
import { uController } from "../utils/dependencyController";
const homeRouter = express.Router() 


homeRouter.get('/checkIsBlocked',UserAuth,(req,res)=>uController.checkIsBlocked(req,res))
homeRouter.get('/getAllFeeds',UserAuth,(req,res)=>uController.getAllFeeds(req,res))
homeRouter.get('/getAllPosts',UserAuth,(req,res)=>uController.getAllPosts(req,res))
homeRouter.get('/getOthersProfilePosts',UserAuth,(req,res)=>uController.getOthersProfile(req,res))
homeRouter.get('/userSearch',UserAuth,(req,res)=>uController.userSearch(req,res))
homeRouter.put('/setThemeMode',UserAuth,(req,res)=>uController.setThemeMode(req,res))
homeRouter.get('/getThemeMode',UserAuth,(req,res)=>uController.getThemeMode(req,res))



export default homeRouter  