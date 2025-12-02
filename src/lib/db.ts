import { MongoClient, Db } from 'mongodb';

let db: Db;

export async function connectDb() {
  if (db) return db; // return existing connection

  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    db = client.db('jolzz'); // database name
    console.log('MongoDB connected');
    return db;
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
}

export { db };
