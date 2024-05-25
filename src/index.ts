import { createServer } from "./infrastructure/config/app";
import dotenv from 'dotenv';
import { connectDB } from "./infrastructure/config/connectDB";
import { server } from "./infrastructure/utils/socketIo";
 // Import the Socket.IO setup function

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer();
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`server runs on port: ${PORT}`);
    });
  } catch (error) {
    console.log('startServer error:', error);
  }
};

startServer();
