import { Rooms } from "../../domain_entities/propertyRoom";
import { IRoomRepository } from "../../useCase/interface/IroomRepository";
import RoomModel from "../database/propertyRoom";

class RoomRepository implements IRoomRepository {
   async addRoom(roomData: Rooms): Promise<any> {
        try {          
          const res = await RoomModel.insertMany(roomData)
          if(res){
            return {success:true,message:'Room added successfully..!'}
          }else{
            return {success:false,message:'Room adding is failed..!'}
          }
        } catch (error) {
            console.log('add room error in room repository :',error);
            throw error
        }
    }
    async fetchRoomData(userId:string|undefined): Promise<any> {
     try {
    
      
      const rooms = await RoomModel.find()
      return rooms
     } catch (error) {
      console.log('fetch room data in room repository',error);
      
     } 
    }
}

export default RoomRepository