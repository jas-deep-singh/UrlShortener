import mongoose from 'mongoose';

async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch(error) {
        console.log('MongoDB connection failed:', error);
        process.exit(0);
    }
}

export default connectDB;