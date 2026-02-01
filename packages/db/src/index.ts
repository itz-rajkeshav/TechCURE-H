import { env } from "@techcure/env/server";
import mongoose from "mongoose";

// Models
export { Course, type ICourse } from "./models/course.model";
export { Subject, type ISubject } from "./models/subject.model";
export { Topic, type ITopic, type IPosition } from "./models/topic.model";
export { UserProgress, type IUserProgress, type ProgressStatus } from "./models/progress.model";
export { User, Session, Account, Verification } from "./models/auth.model";

// Database connection state
let isConnected = false;
let connectionPromise: Promise<typeof mongoose.connection> | null = null;

export async function connectDB() {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = (async () => {
    try {
      await mongoose.connect(env.DATABASE_URL, {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
        // Add additional stability options
        heartbeatFrequencyMS: 1000, // Check connection every second
        retryWrites: true,
      });
      
      isConnected = true;
      console.log("✅ Connected to MongoDB");
      
      // Handle connection events
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
        isConnected = false;
        connectionPromise = null; // Allow reconnection
      });
      
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        isConnected = false;
        connectionPromise = null; // Allow reconnection
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        isConnected = true;
      });
      
      return mongoose.connection;
    } catch (error) {
      console.error("❌ Error connecting to database:", error);
      isConnected = false;
      connectionPromise = null; // Allow retry
      throw error;
    }
  })();

  return connectionPromise;
}

export async function disconnectDB() {
  if (!isConnected && !connectionPromise) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    connectionPromise = null;
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
    throw error;
  }
}

// Improved connection check - only reconnect if truly disconnected
export async function ensureConnection() {
  // Check current connection state
  const state = mongoose.connection.readyState;
  
  switch (state) {
    case 1: // Connected
      if (isConnected) {
        return mongoose.connection;
      }
      break;
    case 2: // Connecting
      if (connectionPromise) {
        return connectionPromise;
      }
      break;
    case 0: // Disconnected
    case 3: // Disconnecting
    default:
      // Need to reconnect
      break;
  }

  return connectDB();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT. Gracefully shutting down...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM. Gracefully shutting down...');
  await disconnectDB();
  process.exit(0);
});

export { mongoose };
