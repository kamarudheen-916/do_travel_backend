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
const ratingSchema = new mongoose_1.Schema({
    raterId: { type: String },
    rate: { type: Number },
    ratedDate: { type: Date, default: new Date() },
    comments: { type: String, default: '' }
});
const roomBookedDatesSchema = new mongoose_1.Schema({
    checkInDate: { type: String },
    checkOutDate: { type: String },
    bookedRoomCount: { type: Number },
});
const RoomSheam = new mongoose_1.Schema({
    propertyId: { type: String },
    roomName: { type: String },
    typeOfRoom: { type: String },
    ratings: { type: [ratingSchema] },
    location: { type: String },
    facilities: { type: [String] },
    revews: { type: [String] },
    price: { type: Number },
    numOfNights: { type: Number },
    numOfAdults: { type: Number },
    numOfRoomLeft: { type: Number },
    freeCancellation: { type: Boolean },
    isBeforePayment: { type: Boolean },
    images: { type: [String] },
    bookedDates: { type: [roomBookedDatesSchema] }
});
const RoomModel = mongoose_1.default.model('Rooms', RoomSheam);
exports.default = RoomModel;
