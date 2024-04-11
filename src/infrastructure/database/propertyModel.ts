import mongoose, { Schema } from "mongoose";
import Property from "../../domain_entities/property";

const PropertySchema : Schema<Property> = new Schema({
    id:{
        type: String
    },
    PropertyName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    isBlocked: {
        type:Boolean
    },
    startedDate:{
        type: Date
    },
    Address:{
        type:String,
        required:true
    },
    TypeOfStay:{
        type:[String],
        required:true
    },
    Speciality:{
        type:[String],
        required:true
    },
    MobileNumber:{
        type:String
    },
    license:{
        type:String,
        required:true
    },
    PropertyProfile:{
        type:String,
        required:true
    },
    IsVerified :{
        type:Boolean,
        required:true
    },
    OTP :{
        type:String,
        required:true
    }
})

const PropertyModel = mongoose.model<Property>('Property',PropertySchema);
export default PropertyModel