import express from "express";
import UserAuth from "../middleware/userAuth";
import { followController } from "../utils/dependencyController";
const followUnfollowRouter = express.Router() 

followUnfollowRouter.post('/FollowRequest',UserAuth,(req,res)=>followController.FollowRequest(req,res))
followUnfollowRouter.put('/unFollowRequest',UserAuth,(req,res)=>followController.unFollowRequest(req,res))
followUnfollowRouter.get('/checkIsFollwoed',UserAuth,(req,res)=>followController.checkIsFollwoed(req,res))
followUnfollowRouter.get('/fetchFollwerRequest',UserAuth,(req,res)=>followController.isFollwerRequest(req,res))
followUnfollowRouter.post('/confirmFollReq',UserAuth,(req,res)=>followController.confirmFollReq(req,res))
followUnfollowRouter.put('/cancelFollReq',UserAuth,(req,res)=>followController.cancelFollReq(req,res))
followUnfollowRouter.get('/fetchAllFollowdata',UserAuth,(req,res)=>followController.fetchAllFollowData(req,res))
followUnfollowRouter.get('/fetchFollowerOriginalData',UserAuth,(req,res)=>followController.fetchFollowerOriginalData(req,res))

export default followUnfollowRouter