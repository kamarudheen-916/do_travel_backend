"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    roomId: { type: String },
    roomName: { type: String },
    roomType: { type: String },
    propertyName: { type: String },
    propertyProfile: { type: String },
    propertyId: { type: String },
    bookingUserId: { type: String },
    First_Name: { type: String },
    Second_Name: { type: String },
    Email: { type: String },
    Nationality: { type: String },
    checkInDate: { type: String },
    checkOutDate: { type: String },
    images: { type: [String] },
    food: { type: [String] },
    facilities: { type: [String] },
    numberOfRoom: { type: Number },
    Mobile: { type: Number },
    numberOfAdults: { type: Number },
    numberOfChilden: { type: Number },
    totalPrice: { type: Number },
    numberDays: { type: Number },
    isCancellationfree: { type: Boolean },
    isBeforePayment: { type: Boolean },
    paymentIsOnline: { type: Boolean },
    bookingStatus: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const bookingModel = mongoose_1.default.model('BookingData', bookingSchema);
exports.default = bookingModel;
