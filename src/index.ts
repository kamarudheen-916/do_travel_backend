import { createServer } from "./infrastructure/config/app";
import dotenv from 'dotenv'
import { connectDB } from "./infrastructure/config/connectDB"; 
dotenv.config()

const startServer = async()=>{
    try {
        await connectDB() 
        const app = createServer()
        const PORT = process.env.PORT || 3000;
        app?.listen(PORT,()=>{
            console.log(`server runs on port :${PORT}`)
        })
    } catch (error) {
        console.log('startServer error :',error)  
    }

}
startServer() 
 
