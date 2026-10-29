import mongoose from "mongoose";
import { env } from "../../constants/env";

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};
