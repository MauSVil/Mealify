import MongoRepository from "./mongo/MongoRepository";
import SupaBaseRepository from "./supabase/SupabaseRepository"

const db = () => {
  // return new SupaBaseRepository();
  return new MongoRepository();
}

export default db;