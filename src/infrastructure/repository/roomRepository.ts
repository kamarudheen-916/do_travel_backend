import { Rooms } from "../../domain_entities/propertyRoom";
import { IRoomRepository } from "../../useCase/interface/IroomRepository";
import RoomModel from "../database/propertyRoom";

class RoomRepository implements IRoomRepository {
async addOrEditRoom(roomData: Rooms, isEdit: boolean): Promise<any> {
    try {  
      console.log(roomData);
      
        if (!isEdit) {
            const res = await RoomModel.insertMany([roomData]);
            if (res) {
                return { success: true, message: 'Room added successfully..!' };
            } else {
                return { success: false, message: 'Room adding failed..!' };
            }
        } else {
            const res = await RoomModel.updateOne({ _id: roomData._id }, { $set: roomData });
            console.log('add or edit room reached', res);

            if (res) {
                return { success: true, message: 'Room edited successfully..!' };
            } else {
                return { success: false, message: 'Room editing failed..!' };
            }
        }
    } catch (error) {
        console.log('add room error in room repository:', error);
        throw error;
    }
}

    async fetchRoomData(userId:string|undefined): Promise<any> {
     try {  
      const rooms = await RoomModel.find({propertyId:userId})
      return rooms
     } catch (error) {
      console.log('fetch room data in room repository',error);
      
     } 
    }

    async deleteRoom(roomId:string): Promise<any> {
      try {  
        const res = await RoomModel.deleteOne({_id:roomId})
        return res        
       
      } catch (error) {
       console.log('fetch room data in room repository',error);
       
      } 
     }
}

export default RoomRepository