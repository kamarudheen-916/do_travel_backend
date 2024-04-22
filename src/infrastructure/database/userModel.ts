import mongoose, { Schema } from "mongoose";
import User from "../../domain_entities/user";

const UserSchema: Schema<User> = new Schema({
    
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean
    },
    gender: {
        type: String
    },
    DOB: {
        type: Date,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    State: {
        type: String,
    },
    MobileNumber: {
        type: String
    },
    City: {
        type: String,
    },
    favoritePlace: {
        type: [String],
    },
    Profile: {
        type: String,
    },
    IsVerified: {
        type: Boolean,
        required: true
    },
    OTP: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const UserModel = mongoose.model<User>('User', UserSchema);
export { UserModel };
