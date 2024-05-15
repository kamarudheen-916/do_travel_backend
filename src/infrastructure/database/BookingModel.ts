import mongoose, {Schema} from "mongoose"
import { bookingData } from "../../domain_entities/BookingData"

const bookingSchema = new Schema<bookingData>({
    roomId:{type:String},
    roomName:{type:String},
    roomType:{type:String},
    propertyName:{type:String},
    propertyProfile:{type:String},
    propertyId:{type:String},
    bookingUserId:{type:String},
    First_Name:{type:String},
    Second_Name:{type:String},
    Email:{type:String},
    Nationality:{type:String},
    checkInDate:{type:String},
    checkOutDate:{type:String},
    images:{type:[String]},
    food:{type:[String]},
    facilities:{type:[String]},
    numberOfRoom:{type:Number},
    Mobile:{type:Number},
    numberOfAdults:{type:Number},
    numberOfChilden:{type:Number},
    totalPrice:{type:Number},
    numberDays:{type:Number},
    isCancellationfree:{type:Boolean},
    isBeforePayment:{type:Boolean},
    paymentIsOnline:{type:Boolean},
    bookingStatus:{type:String},
    location:{type:String}
})

const bookingModel = mongoose.model<bookingData>('BookingData',bookingSchema)
export default bookingModel