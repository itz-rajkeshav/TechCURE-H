import { env } from "@techcure/env/server";
import mongoose from "mongoose";

// Models
export { Course, type ICourse } from "./models/course.model";
export { Subject, type ISubject } from "./models/subject.model";
export { Topic, type ITopic, type IPosition } from "./models/topic.model";
export { UserProgress, type IUserProgress, type ProgressStatus } from "./models/progress.model";
export { User, Session, Account, Verification } from "./models/auth.model";

// Database connection
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.DATABASE_URL);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    throw error;
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
    throw error;
  }
}

// Initialize connection on import
try {
  await mongoose.connect(env.DATABASE_URL);
  isConnected = true;
} catch (error) {
  console.log("Error connecting to database:", error);
}

const client = mongoose.connection.getClient().db("learnpath");

export { client, mongoose };
