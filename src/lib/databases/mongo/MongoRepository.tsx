import { MongoClient } from "mongodb";
import clientPromise from "./client";

class MongoRepository {
  client: Promise<MongoClient>;

  constructor() {
    this.client = clientPromise;
  }

  async get(collection: string) {
    const client = await this.client;
    const data = await client.db().collection(collection).find().toArray();
    return data;
  }

  async create(collection: string, data: any) {
    const client = await this.client;
    const response = await client.db().collection(collection).insertOne(data);
    return response;
  }

  // async update(collection: string, data: any) {
  //   const client = await this.client;
  //   const response = await client.db().collection(collection).updateOne(data);
  //   return response;
  // }

  async delete(collection: string, id: string) {
    const client = await this.client;
    const response = await client.db().collection(collection).deleteOne({ id });
    return response;
  }
}

export default MongoRepository;