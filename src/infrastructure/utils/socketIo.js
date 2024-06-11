"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
const usersSocketMap = {};
const getReceiverSocketId = (receiverId) => {
    return usersSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    const userId = socket.handshake.query.userId;
    if (userId) {
        usersSocketMap[userId] = socket.id;
    }
    console.log('user socket map:', usersSocketMap);
    io.emit('getOnlineUsers', Object.keys(usersSocketMap));
    socket.on('typing', (data) => {
        const receiverSocketId = (0, exports.getReceiverSocketId)(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing', data);
        }
    });
    socket.on('stopTyping', (data) => {
        const receiverSocketId = (0, exports.getReceiverSocketId)(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('stopTyping', data);
        }
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id}: 🔥 user disconnected`);
        if (userId) {
            delete usersSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(usersSocketMap));
        }
        // socket.disconnect();
    });
});
