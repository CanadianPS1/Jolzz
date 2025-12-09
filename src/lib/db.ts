import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (database) return database; 

  client = new MongoClient("mongodb://127.0.0.1:27017");

  await client.connect();
  database = client.db("jolzz");

  console.log("MongoDB connected");
  return database;
}

export async function getDb(): Promise<Db> {
  return await connectDb();
}
