import mongoose from "mongoose";

const connectToDatabase = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      bufferCommands: true,
      maxPoolSize: 50,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 35000,
      tls: true,
      tlsInsecure: false,
      bufferCommands: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(`MongoDB connection Failed:: ${error}`);
    process.exit(1);
  }
};

export default connectToDatabase;
