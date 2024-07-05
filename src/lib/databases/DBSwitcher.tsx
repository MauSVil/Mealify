import SupaBaseRepository from "./supabase/SupabaseRepository"

const db = () => {
  return new SupaBaseRepository();
}

export default db;