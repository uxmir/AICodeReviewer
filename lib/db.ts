import { MongoClient } from "mongodb";
import mongoose from "mongoose";
const uri = process.env.MONGO_URI as string;
if (!uri) {
  throw new Error("Please add your MONGO_URI to .env");
}

// Global type declaration for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().then((client) => {
      console.log("🟢 [MongoDB Native Client] Connected successfully (Dev Cache)");
      return client;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect().then((client) => {
    console.log("🟢 [MongoDB Native Client] Connected successfully (Production)");
    return client;
  });
}

export { clientPromise };

export const dbConnect = async () => {
  // 
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  //  Development mode
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoosePromise) {
      global._mongoosePromise = mongoose.connect(uri).then((m) => {
        console.log("🟢 [Mongoose Connection] Connected successfully (Dev Cache)");
        return m;
      });
    }
    await global._mongoosePromise;
    return mongoose.connection;
  }

  //  Production mode-
  await mongoose.connect(uri);
  console.log("🟢 [Mongoose Connection] Connected successfully (Production)");
  return mongoose.connection;
};