import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const URI = process.env.MONGODB_URI;

if (!URI) {
  throw new Error('Missing MONGODB_URI');
}

let client = new MongoClient(URI);
let clientPromise;

if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise as Promise<MongoClient>;