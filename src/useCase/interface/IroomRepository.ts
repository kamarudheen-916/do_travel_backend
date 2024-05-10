import { Rooms } from "../../domain_entities/propertyRoom";

export interface IRoomRepository {
    addRoom(roomData:Rooms):Promise<any>
    fetchRoomData(userId:string|undefined):Promise<any>
} 