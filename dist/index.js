"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = require("./infrastructure/config/connectDB");
const socketIo_1 = require("./infrastructure/utils/socketIo");
// Import the Socket.IO setup function
dotenv_1.default.config();
const startServer = async () => {
    try {
        await (0, connectDB_1.connectDB)();
        const httpServer = (0, app_1.createServer)();
        const PORT = process.env.PORT || 4000;
        socketIo_1.server.listen(PORT, () => {
            console.log(`server runs on port: ${PORT}`);
        });
    }
    catch (error) {
        console.log('startServer error:', error);
    }
};
startServer();
