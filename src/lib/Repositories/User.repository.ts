import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db, ObjectId } from "mongodb";
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
    const { id, ...rest } = filters;
    const user = await db.collection('users').findOne<User>({
      ...(id ? { _id: new ObjectId(id) } : {}),
      ...rest
    });
    return user;
  }

  static async find(filter: UserRepositoryFilter = {}): Promise<User[]> {
    await init();
    const filters = await UserRepositoryFilterModel.parse(filter);
    const { id, ...rest } = filters;
    const users = await db.collection('users').find<User>({
      ...(id ? { _id: new ObjectId(id) } : {}),
      ...rest
    }).toArray();
    return users;
  }

  static async insertOne(user: User): Promise<string> {
    await init();
    const { _id, ...rest } = user;
    const insertedId = (await db.collection('users').insertOne({ ...rest })).insertedId;
    return insertedId.toString();
  }

  static async updateOne(id: string, user: Partial<User>): Promise<string> {
    await init();
    const { _id, ...rest } = user;

    if (!id) {
      throw new Error('Id not found');
    }

    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: { ...rest } });
    return 'El usuario ha sido actualizado';
  }
}