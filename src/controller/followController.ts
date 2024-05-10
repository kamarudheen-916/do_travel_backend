import FollowUseCase from "../useCase/FollowUseCase";
import { Request,Response } from "express";
class FollowController{
    constructor(private readonly fUseCase:FollowUseCase ){}

    async FollowRequest (req:Request,res:Response){
        try {
            const data = req.body
            const Response =  await this.fUseCase.FollowRequest(data)
            res.json(Response)
        } catch (error) {
            console.log('Follow request error in follow controller:',error);
            throw error
        }
    }
    async unFollowRequest (req:Request,res:Response){
        try {
            const data = req.body
            const Response =  await this.fUseCase.unFollowRequest(data)
            res.json(Response)
        } catch (error) {
            console.log('Follow request error in follow controller:',error);
            throw error
        }
    }
    async checkIsFollwoed (req:Request,res:Response){
        try {
            const data = req.query
           
            const Response =  await this.fUseCase.checkIsFollwoed(data)
            res.json(Response)
        } catch (error) {
            console.log('checkIsFollwoed  error in follow controller:',error);
            throw error
        }
    }
    async isFollwerRequest (req:Request,res:Response){
        try {
            const data = req.query
            const Response =  await this.fUseCase.isFollwerRequest(data)
            res.json(Response)
        } catch (error) {
            console.log('checkIsFollwoed  error in follow controller:',error);
            throw error
        }
    }

    async confirmFollReq (req:Request,res:Response){
        try {
            const data = req.body
         
            const Response =  await this.fUseCase.confirmFollReq(data)
            res.json(Response)
        } catch (error) {
            console.log('checkIsFollwoed  error in follow controller:',error);
            throw error
        }
    }

    async cancelFollReq (req:Request,res:Response){
        try {
            const data = req.body
            const Response =  await this.fUseCase.cancelFollReq(data)
            res.json(Response)
        } catch (error) {
            console.log('checkIsFollwoed  error in follow controller:',error);
            throw error
        }
    }
    async fetchAllFollowData (req:Request,res:Response){
        try {
            const {userId} = req.query
            const Response =  await this.fUseCase.fetchAllFollowData(userId)
            res.json(Response)
        } catch (error) {
            console.log('checkIsFollwoed  error in follow controller:',error);
            throw error
        }
    }
    async fetchFollowerOriginalData (req:Request,res:Response){
        try {
        
            const {isFollowing,userId} =req.query
            const Response =  await this.fUseCase.fetchFollowerOriginalData(userId,isFollowing)
            console.log('follwer data :====>',Response);
            res.json(Response)
        } catch (error) {
            console.log('checkIsFollwoed  error in follow controller:',error);
            throw error
        }
    }
}
export default FollowController