import express from "express";
import UserAuth from "../middleware/userAuth";
import { uController } from "../utils/dependencyController";
const postCommentRouter = express.Router() 

postCommentRouter.post('/userCreate',UserAuth,(req,res)=>uController.userCreate(req,res))
postCommentRouter.post('/postComment',UserAuth,(req,res)=>uController.postComment(req,res))
postCommentRouter.post('/postReplayComment',UserAuth,(req,res)=>uController.postReplayComment(req,res))
postCommentRouter.get('/fetchReplayComment',UserAuth,(req,res)=>uController.fetchReplayComment(req,res))
postCommentRouter.post('/reportPost',UserAuth,(req,res)=>uController.reportPost(req,res))
postCommentRouter.delete('/deleteComment',UserAuth,(req,res)=>uController.deleteComment(req,res))
postCommentRouter.put('/editComment',UserAuth,(req,res)=>uController.editComment(req,res))

postCommentRouter.put('/saveOrUnSavePost',UserAuth,(req,res)=>uController.saveOrUnSavePost(req,res))
postCommentRouter.get('/isPostSaved',UserAuth,(req,res)=>uController.isPostSaved(req,res))
postCommentRouter.put('/likeOrUnLikePost',UserAuth,(req,res)=>uController.likeOrUnLikePost(req,res))
postCommentRouter.get('/isPostLiked',UserAuth,(req,res)=>uController.isPostLiked(req,res))
postCommentRouter.get('/fetchPostLikersData',UserAuth,(req,res)=>uController.fetchPostLikersData(req,res))
postCommentRouter.delete('/deletePost',UserAuth,(req,res)=>uController.deletePost(req,res))

export default postCommentRouter