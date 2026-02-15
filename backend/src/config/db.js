import mongoose from 'mongoose';
import {ENV} from './env.js';


//method to connect to the database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
}
