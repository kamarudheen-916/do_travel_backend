import mongoose ,{Schema} from "mongoose";
import { Rooms } from "../../domain_entities/propertyRoom";
import { ratingData } from "../../domain_entities/Post";


const ratingSchema :Schema<ratingData> = new Schema({
    raterId:{type:String},
    rate:{type:Number},
    ratedDate:{type:Date,default : new Date()},
    comments:{type:String,default:''}
})

const RoomSheam :Schema<Rooms> = new Schema({
    propertyId:{type:String},
    roomName:{type:String},
    typeOfRoom:{type:String},
    ratings:{type:[ratingSchema]},
    location:{type:String},
    facilities:{type:[String]},
    revews:{type:[String]},
    price:{type:Number},
    numOfNights:{type:Number},
    numOfAdults:{type:Number},
    numOfRoomLeft:{type:Number},
    freeCancellation:{type:Boolean},
    isBeforePayment:{type:Boolean},
    images:{type:[String]}
})

const RoomModel = mongoose.model<Rooms>('Rooms',RoomSheam)
export default RoomModel