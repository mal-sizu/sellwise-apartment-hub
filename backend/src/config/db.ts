import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://dynactechnologies:E5flGAqgs0z2lRor@cluster0.ngsjvi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    if (!mongoUri) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error('An unknown error occurred while connecting to MongoDB');
    }
    process.exit(1);
  }
};

export default connectDB;