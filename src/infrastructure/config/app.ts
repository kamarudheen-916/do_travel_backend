import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from '../routes/userRouter';
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
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      })
    );
    app.use('/api/user/', userRouter);
    app.use('/api/admin/', adminRouter);

    const httpServer = http.createServer(app);

    return httpServer ;
  } catch (error) {
    console.log('create server error:', error);
  }
};
