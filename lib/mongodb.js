import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const MONGO_URI = process.env.DATABASE_MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("DATABASE_MONGODB_URI is not defined");
}

const globalForMongo = globalThis;

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);

    attachDatabasePool(client);

    globalForMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalForMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URI, options);

  attachDatabasePool(client);

  clientPromise = client.connect();
}

export default clientPromise;