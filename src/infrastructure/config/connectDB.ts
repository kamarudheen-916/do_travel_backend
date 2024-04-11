import mongoose from 'mongoose'

export const connectDB = async () =>{
    try {
        
        const mongoUri = process.env.MONGO_URI as string 
        console.log('mongo URI :-',mongoUri);
        
        await mongoose.connect(mongoUri)
        console.log('mongodb connected');
    } catch (error) {
        console.log('mongodb connection error :',error)
    }
}