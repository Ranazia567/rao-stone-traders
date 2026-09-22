import mongoose from 'mongoose';

export let dbConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rao_stone';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    dbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    dbConnected = false;
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.warn('Fallback active: Server operating in resilient in-memory mock mode.');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  dbConnected = false;
  console.warn('MongoDB disconnected. Switched to mock mode.');
});

mongoose.connection.on('reconnected', () => {
  dbConnected = true;
  console.log('MongoDB reconnected.');
});

export const isDbReady = () => dbConnected && mongoose.connection.readyState === 1;

export default connectDB;
