import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import userRouter from '../routes/userRouter'
import path from 'path'
dotenv.config()
export const createServer = () =>{
    try {
        const app = express()
        app.use(express.json({limit:'50mb'})); 
        app.use(express.urlencoded({extended:true,limit:'50mb'})) 
        console.log('__dirname',path.resolve(__dirname,'../../..'));
        const parentDirectory = path.resolve(__dirname,'../../..');
        app.use(express.static(path.join(parentDirectory+'/public')))
        app.use(
            cors({
                origin:'http://localhost:5173', 
                methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials:true
            })
        )
        app.use('/api/user/',userRouter)
        return app
    } catch (error) {
        console.log('create server error:',error);
        
    }
}

