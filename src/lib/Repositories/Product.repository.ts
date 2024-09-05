import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db } from "mongodb";
import { Product, ProductRepositoryFilter, ProductRepositoryFilterModel } from "../types/Zod/Product";

let client;
let db: Db;

const init = async () => {
  client = await clientPromise;
  db = client.db('test') as Db;
};

export class ProductsRepository {
  static async findOne(filter: ProductRepositoryFilter = {}): Promise<Product | null> {
    await init();
    const filters = await ProductRepositoryFilterModel.parse(filter);
    const user = await db.collection('products').findOne<Product>(filters);
    return user;
  }

  static async find(filter: ProductRepositoryFilter = {}): Promise<Product[]> {
    await init();
    const filters = await ProductRepositoryFilterModel.parse(filter);
    const orders = await db.collection('products').find<Product>(filters).toArray();
    return orders;
  }

  static async insertOne(user: Product): Promise<string> {
    await init();
    const { _id, ...rest } = user;
    await db.collection('products').insertOne({ ...rest });
    return 'El usuario ha sido creado';
  }
}