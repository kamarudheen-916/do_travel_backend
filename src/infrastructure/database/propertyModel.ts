import mongoose, { Schema } from "mongoose";
import Property from "../../domain_entities/property";

const PropertySchema : Schema<Property> = new Schema({
  
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
       
    },
    TypeOfStay:{
        type:[String],
       
    },
    Speciality:{
        type:[String], 
       
    },
    MobileNumber:{
        type:String
    },
    license:{
        type:String,
       
    },
    PropertyProfile:{
        type:String,
       
    },
    IsVerified :{
        type:Boolean,
       
    },
    OTP :{
        type:String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const PropertyModel = mongoose.model<Property>('Property',PropertySchema);
export default PropertyModel