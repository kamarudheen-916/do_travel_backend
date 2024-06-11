"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = __importDefault(require("../routes/userRouter"));
const bookingRoute_1 = __importDefault(require("../routes/bookingRoute"));
const chatRouter_1 = __importDefault(require("../routes/chatRouter"));
const followAndUnfollwoRoute_1 = __importDefault(require("../routes/followAndUnfollwoRoute"));
const postAndCommentRouter_1 = __importDefault(require("../routes/postAndCommentRouter"));
const profileAndRoomRoute_1 = __importDefault(require("../routes/profileAndRoomRoute"));
const userAuthRouter_1 = __importDefault(require("../routes/userAuthRouter"));
const path_1 = __importDefault(require("path"));
const adminRouter_1 = __importDefault(require("../routes/adminRouter"));
const http_1 = __importDefault(require("http"));
const socketIo_1 = require("../utils/socketIo");
dotenv_1.default.config();
const createServer = () => {
    try {
        socketIo_1.app.use(express_1.default.json({ limit: '250mb' }));
        socketIo_1.app.use(express_1.default.urlencoded({ extended: true, limit: '250mb' }));
        const parentDirectory = path_1.default.resolve(__dirname, '../../..');
        socketIo_1.app.use(express_1.default.static(path_1.default.join(parentDirectory + '/public')));
        socketIo_1.app.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        }));
        socketIo_1.app.use('/api/user/', userAuthRouter_1.default);
        socketIo_1.app.use('/api/user/', userRouter_1.default);
        socketIo_1.app.use('/api/user/', bookingRoute_1.default);
        socketIo_1.app.use('/api/user/', chatRouter_1.default);
        socketIo_1.app.use('/api/user/', followAndUnfollwoRoute_1.default);
        socketIo_1.app.use('/api/user/', postAndCommentRouter_1.default);
        socketIo_1.app.use('/api/user/', profileAndRoomRoute_1.default);
        socketIo_1.app.use('/api/admin/', adminRouter_1.default);
        const httpServer = http_1.default.createServer(socketIo_1.app);
        return httpServer;
    }
    catch (error) {
        console.log('create server error:', error);
    }
};
exports.createServer = createServer;
