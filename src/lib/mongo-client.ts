// src/lib/mongo-client.ts
// better-auth's mongodbAdapter requires the native `mongodb` driver's Db/MongoClient —
// it does not accept a mongoose connection. Keep this separate from lib/db.ts
// (which is mongoose, used by our own Package/Booking/Review models).

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

declare global {
  var _mongoNativeClient: MongoClient | undefined;
}

export const mongoClient: MongoClient = global._mongoNativeClient ?? new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV === "development") {
  global._mongoNativeClient = mongoClient;
}

// better-auth needs a Db instance (uses the default DB from the connection string).
export const mongoDb = mongoClient.db(process.env.DATABASE_NAME);
