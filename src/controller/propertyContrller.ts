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
            const isEdit = false
            const Res = await this.usercase.add_edit_Room(roomData,isEdit)
            res.json(Res)
        } catch (error) {
            
        }
    }
    async editRoom (req:Request,res:Response){
        try {
            const roomData = req.body
            const userId = req.userId
            roomData.propertyId = userId
            const isEdit = true
            const Res = await this.usercase.add_edit_Room(roomData,isEdit)
            res.json(Res)
        } catch (error) {
            
        }
    }
    async deleteRoom (req:Request,res:Response){
        try {
            const roomId = req.query.roomId
            const propertyId = req.userId

            const Res = await this.usercase.deleteRoom(roomId)
            if(Res.deletedCount > 0){
                const rooms = await this.usercase.fetchRoomData(propertyId)
                if(rooms){
                    console.log('rooms :',rooms);
                    
                    res.json( { success: true, message: 'Room Deleted successfully..!' ,rooms})
                }else{
                    res.json( { success: true, message: 'Room Deleted successfully..!' })
                }
              
              }else{
                res.json ({ success: false, message: 'Room deleting failed..!' })
              }
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