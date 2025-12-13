import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  family: 4, // ⚡ Force IPv4 for serverless
};

let cached = globalThis as typeof globalThis & { _mongo?: { client: MongoClient; db: Db } };

export async function connectDB(): Promise<Db> {
  if (cached._mongo) {
    return cached._mongo.db;
  }

  const client = new MongoClient(uri, options);
  await client.connect();
  const db = client.db("sweet_shop"); // make sure this matches your Atlas DB name
  cached._mongo = { client, db };
  return db;
}
