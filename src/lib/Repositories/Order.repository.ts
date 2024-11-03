import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db, ObjectId } from "mongodb";
import { Order, OrderRepositoryFilter, OrderRepositoryFilterModel } from "../types/Zod/Order";

let client;
let db: Db;

const init = async () => {
  client = await clientPromise;
  db = client.db('test') as Db;
};

export class OrderRepository {
  static async findOne(filter: OrderRepositoryFilter = {}): Promise<Order | null> {
    await init();
    const filters = await OrderRepositoryFilterModel.parse(filter);
    const { id, ...rest } = filters;
    const order = await db.collection('orders').findOne<Order>({
      ...(id ? { _id: new ObjectId(id) } : {}),
      ...rest
    });
    return order;
  }

  static async find(filter: OrderRepositoryFilter = {}): Promise<Order[]> {
    await init();
    const filters = await OrderRepositoryFilterModel.parse(filter);
    const orders = await db.collection('orders').find<Order>({
      ...filters,
    }, { sort: { createdAt: -1 } }).toArray();
    return orders;
  }

  static async insertOne(order: Order): Promise<string> {
    await init();
    const { _id, ...rest } = order;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.deletedAt = null;
    const insertedId =(await db.collection('orders').insertOne({ ...rest })).insertedId;
    return insertedId.toString();
  }

  static async updateOne(id: string, order: Partial<Order>): Promise<string> {
    await init();
    const { _id, ...rest } = order;

    if (!id) {
      throw new Error('Id not found');
    }

    await db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: { ...rest } });
    return 'La orden ha sido actualizado';
  }
}