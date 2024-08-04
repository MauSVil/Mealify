import { Db } from "mongodb";
import clientPromise from "..";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

let client;
let db: Db;

const init = async () => {
  client = await clientPromise;
  db = client.db() as Db;
};

export const login = async ({ email, password, role }: { email: string, password: string, role: string }) => {
  try {
    await init();
    const usersCollection = db.collection<Partial<User>>('users');
    const user = await usersCollection.findOne({ email, role });
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password as string);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '365d' });

    return token;
  } catch (e) {
    console.error('Error logging in', e);
    throw new Error('Error logging in');
  }
};

export const register = async (user: Partial<User>) => {
  try {
    await init();
    const usersCollection = db.collection<Partial<User>>('users');

    const { password, email, ...rest } = user;
    if (!password || !email) {
      throw new Error('Los campos email y password son requeridos');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({ email, password: hashedPassword, ...rest });

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '365d' });

    return token;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Error registering user, ${e?.message}`);
    }
    console.error('Error registering user', e);
  }
};