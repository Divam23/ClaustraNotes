import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();


const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if(!mongoUri){
        throw new Error("Mongo Uri not defined");
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });


    const connectionInstance = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10_000,
        connectTimeoutMS: 10_000,
    });
    console.log(`\nMongoDB Connected!! DB HOST: ${connectionInstance.connection.host}`);
};

export { connectDB };
