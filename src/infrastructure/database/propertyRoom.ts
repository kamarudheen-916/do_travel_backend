import mongoose ,{Schema} from "mongoose";
import { Rooms } from "../../domain_entities/propertyRoom";

const RoomSheam :Schema<Rooms> = new Schema({
    propertyId:{type:String},
    roomName:{type:String},
    typeOfRoom:{type:String},
    rating:{type:Number,default:0},
    location:{type:String},
    facilities:{type:[String]},
    revews:{type:[String]},
    price:{type:Number},
    numOfnights:{type:Number},
    numOfAdults:{type:Number},
    numOfRoomLeft:{type:Number},
    freeCancellation:{type:Boolean},
    isBeforePayment:{type:Boolean},
    images:{type:[String]}
})

const RoomModel = mongoose.model<Rooms>('Rooms',RoomSheam)
export default RoomModel