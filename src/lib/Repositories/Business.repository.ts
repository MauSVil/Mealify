import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db, ObjectId } from "mongodb";
import { Business, BusinessRepositoryFilter, BusinessRepositoryFilterModel } from "../types/Zod/Business";

let client;
let db: Db;

const init = async () => {
  client = await clientPromise;
  db = client.db('test') as Db;
};

export class BusinessRepository {
  static async findOne(filter: BusinessRepositoryFilter = {}): Promise<Business | null> {
    await init();
    const filters = await BusinessRepositoryFilterModel.parse(filter);
    const business = await db.collection('businesses').findOne<Business>(filters);
    return business;
  }

  static async find(filter: BusinessRepositoryFilter = {}): Promise<Business[]> {
    await init();
    const filters = await BusinessRepositoryFilterModel.parse(filter);
    const businesses = await db.collection('businesses').find<Business>(filters).toArray();
    return businesses;
  }

  static async insertOne(business: Business): Promise<string> {
    await init();
    const { _id, ...rest } = business;
    const insertedId =(await db.collection('businesses').insertOne({ ...rest })).insertedId;
    return insertedId.toString();
  }

  static async updateOne(id: string, business: Partial<Business>): Promise<string> {
    await init();
    const { _id, ...rest } = business;

    if (!id) {
      throw new Error('Id not found');
    }

    await db.collection('businesses').updateOne({ _id: new ObjectId(id) }, { $set: { ...rest } });
    return 'El business ha sido actualizado';
  }
}