import { Rooms } from "../../domain_entities/propertyRoom";

export interface IRoomRepository {
    addOrEditRoom(roomData:Rooms,isEdit:boolean):Promise<any>
    fetchRoomData(userId:string|undefined):Promise<any>
    deleteRoom(roomId:string):Promise<any>

} 