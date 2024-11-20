import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db, ObjectId } from "mongodb";
import { Address, AddressRepositoryFilter, AddressRepositoryFilterModel } from "../types/Zod/Address";

let client;
let db: Db;

const init = async () => {
  client = await clientPromise;
  db = client.db('test') as Db;
};

export class AddressRepository {
  static async findOne(filter: AddressRepositoryFilter = {}): Promise<Address | null> {
    await init();
    const filters = await AddressRepositoryFilterModel.parse(filter);
    const { id, ...rest } = filters;
    const address = await db.collection('addresses').findOne<Address>({
      ...(id ? { _id: new ObjectId(id) } : {}),
      ...rest
    });
    return address;
  }

  static async find(filter: AddressRepositoryFilter = {}): Promise<Address[]> {
    await init();
    const filters = await AddressRepositoryFilterModel.parse(filter);
    const addresses = await db.collection('addresses').find<Address>(filters).toArray();
    return addresses;
  }

  static async insertOne(address: Address): Promise<string> {
    await init();
    const { _id, ...rest } = address;
    const insertedId = (await db.collection('addresses').insertOne({ ...rest })).insertedId;
    return insertedId.toString();
  }
}