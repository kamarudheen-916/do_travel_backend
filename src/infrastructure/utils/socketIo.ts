import { Server } from 'socket.io';
import http from 'http'
import express from 'express';

const app = express()

interface UsersSocketMap {
  [userId: string]: string;
}



const server = http.createServer(app)

const io = new Server(server,{
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
})

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



  socket.on('disconnect', () => {
    console.log(`${socket.id}: 🔥 user disconnected`);
    if (userId) {
      delete usersSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(usersSocketMap));
    }
    // socket.disconnect();
  });
});


export {app,io,server}


// export const setupSocketServer = (httpServer: any) => {
//   const io = new SocketIOServer(httpServer, {
//     cors: {
//       origin: ['http://localhost:5173'],
//       methods: ['GET', 'POST'],
//     },
//   });
  

//   io.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);

//     const userId = socket.handshake.query.userId as string | undefined;
//     if (userId) {
//       usersSocketMap[userId] = socket.id;
//     }
//     console.log('user socket map:', usersSocketMap);

//     io.emit('getOnlineUsers', Object.keys(usersSocketMap));

//     // socket.on('newChat', (data) => {
//     //   console.log('socket io data :', data);
//     //   const user = { userId: data.profileId, socketID: socket.id };
//     //   users.push(user);
//     //   io.emit('newUserResponse', users);
//     // });

//     // socket.on('message', (data) => {
//     //   const recipient = users.find((user: any) => user.userId === data.recipientId);
//     //   if (recipient) {
//     //     io.to(recipient.socketID).emit('messageResponse', data);
//     //   } else {
//     //     socket.emit('messageResponse', { text: 'User not found', name: 'System' });
//     //   }
//     // });

//     // socket.on('typing', (data) => {
//     //   const recipient = users.find((user: any) => user.userId === data.recipientId);
//     //   if (recipient) {
//     //     socket.broadcast.to(recipient.socketID).emit('typingResponse', data.message);
//     //   }
//     // });

//     socket.on('disconnect', () => {
//       console.log(`${socket.id}: 🔥 user disconnected`);
//       if (userId) {
//         delete usersSocketMap[userId];
//         io.emit('getOnlineUsers', Object.keys(usersSocketMap));
//       }
//       // socket.disconnect();
//     });
//   });

//   return io;
// };
