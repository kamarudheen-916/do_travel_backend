import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import homeRouter from '../routes/userRouter';
import bookingRouter from '../routes/bookingRoute';
import chatRouter from '../routes/chatRouter';
import followUnfollowRouter from '../routes/followAndUnfollwoRoute';
import postCommentRouter from '../routes/postAndCommentRouter';
import porfileAndRoomRouter from '../routes/profileAndRoomRoute';
import userAuthRouter from '../routes/userAuthRouter';
import path from 'path';
import adminRouter from '../routes/adminRouter';
import http from 'http';
import { app } from '../utils/socketIo';

dotenv.config();

export const createServer = () => {
  try {
   
    app.use(express.json({ limit: '250mb' }));
    app.use(express.urlencoded({ extended: true, limit: '250mb' }));
    const parentDirectory = path.resolve(__dirname, '../../..');
    app.use(express.static(path.join(parentDirectory + '/public')));
    app.use(
      cors({
        origin: 'https://do-travel-frontend-z91y.vercel.app',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      })
    );
    app.get('/',(req,res)=>{
  res.json('done')
    })
    app.use('/api/user/', userAuthRouter);
    app.use('/api/user/', homeRouter);
    app.use('/api/user/', bookingRouter);
    app.use('/api/user/', chatRouter);
    app.use('/api/user/', followUnfollowRouter);
    app.use('/api/user/', postCommentRouter);
    app.use('/api/user/', porfileAndRoomRouter);
    app.use('/api/admin/', adminRouter);

    const httpServer = http.createServer(app);

    return httpServer ;
  } catch (error) {
    console.log('create server error:', error);
  }
};
