import clientPromise from "@/mongodb";
import _ from "lodash";
import { Db, ObjectId } from "mongodb";
import { NewProductSchema, Product, ProductRepositoryFilter, ProductRepositoryFilterModel } from "../types/Zod/Product";

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

  static async insertOne(product: Product): Promise<string> {
    await init();

    const body = await NewProductSchema.parseAsync(product);
    const insertedId = (await db.collection('products').insertOne(body)).insertedId;
    return insertedId.toString();
  }

  static async updateOne(id: string, product: Partial<Product>): Promise<string> {
    await init();
    const { _id, ...rest } = product;

    if (!id) {
      throw new Error('Id not found');
    }

    await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: { ...rest } });
    return 'El producto ha sido actualizado';
  }
}