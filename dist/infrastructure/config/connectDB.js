"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        console.log('mongo URI :-', mongoUri);
        console.log("Mongo URI:", process.env.MONGO_URI);
        await mongoose_1.default.connect(mongoUri);
        console.log('mongodb connected');
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.error(error);
    }
};
exports.connectDB = connectDB;
