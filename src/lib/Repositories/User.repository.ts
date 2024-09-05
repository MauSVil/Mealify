import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db } from "mongodb";
import { User, UserRepositoryFilter, UserRepositoryFilterModel } from "../types/Zod/User";

let client;
let db: Db;

const init = async () => {
  client = await clientPromise;
  db = client.db('test') as Db;
};

export class UsersRepository {
  static async findOne(filter: UserRepositoryFilter = {}): Promise<User | null> {
    await init();
    const filters = await UserRepositoryFilterModel.parse(filter);
    const user = await db.collection('users').findOne<User>(filters);
    return user;
  }

  static async find(filter: UserRepositoryFilter = {}): Promise<User[]> {
    await init();
    const filters = await UserRepositoryFilterModel.parse(filter);
    const orders = await db.collection('users').find<User>(filters).toArray();
    return orders;
  }

  static async insertOne(user: User): Promise<string> {
    await init();
    const { _id, ...rest } = user;
    await db.collection('users').insertOne({ ...rest });
    return 'El usuario ha sido creado';
  }
}