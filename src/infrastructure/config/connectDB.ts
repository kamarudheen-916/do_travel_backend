import mongoose from 'mongoose'

export const connectDB = async () =>{
    try {
        
        const mongoUri = process.env.MONGO_URI as string 
        console.log('mongo URI :-',mongoUri);
        console.log("Mongo URI:", process.env.MONGO_URI);
        await mongoose.connect(mongoUri)
        console.log('mongodb connected');
    } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    console.error(error);
}

}