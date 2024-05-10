import UserUseCase from "../useCase/UserUseCase";
import { Request,Response } from "express";
class propertyController {
    constructor(private readonly usercase : UserUseCase){}
    
    async propertyCreate (req:Request,res:Response) {
        try {
            const PostData = req.body
            const Response = await this.usercase.userCreate(PostData)
            res.json(Response)
        } catch (error) {
            console.log('propertyCreate error  :',error);
            
        }
    }
    async addRoom (req:Request,res:Response){
        try {
            const roomData = req.body
            const userId = req.userId
            roomData.propertyId = userId
            const Res = await this.usercase.addRoom(roomData)
            res.json(Res)
        } catch (error) {
            
        }
    }
    async fetchRoomData (req:Request,res:Response){
        try {
            const userId = req.userId
            const Res = await this.usercase.fetchRoomData(userId)
             res.json(Res)
        } catch (error) {
            
        }
    }
    async fetchOtherProfileRoomData (req:Request,res:Response){
        try {
            
            const { profileId } = req.query;
            const userId = profileId
            const Res = await this.usercase.fetchRoomData(userId)

            
            res.json(Res)
        } catch (error) {
            
        }
    }
}

export default propertyController