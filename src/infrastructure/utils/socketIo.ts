import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

interface UsersSocketMap {
  [userId: string]: string;
}

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:5173'],
//     methods: ['GET', 'POST'],
//   },
// });

const io = new Server(server, {
  cors: {
    origin: ['https://do-travel-frontend-z91y.vercel.app'],
    methods: ['GET', 'POST'],
  },
});
const usersSocketMap: UsersSocketMap = {};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return usersSocketMap[receiverId];
};

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  const userId = socket.handshake.query.userId as string | undefined;
  if (userId) {
    usersSocketMap[userId] = socket.id;
  }
  console.log('user socket map:', usersSocketMap);

  io.emit('getOnlineUsers', Object.keys(usersSocketMap));

  socket.on('typing', (data) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', data);
    }
  });

  socket.on('stopTyping', (data) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
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

export { app, io, server };
