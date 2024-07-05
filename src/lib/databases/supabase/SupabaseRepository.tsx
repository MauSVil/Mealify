import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";

class SupaBaseRepository {
  client: SupabaseClient;
  constructor() {
    this.client = getSupabaseClient();
  }

  async get(collection: string) {
    const { data, error } = await this.client.from(collection).select();
    return { data, error };
  }

  async create(collection: string, data: any) {
    const { data: clientData, error } = await this.client.from(collection).insert(data);
    return { data: clientData, error };
  }

  async update(collection: string, data: any) {
    const { data: clientData, error } = await this.client.from(collection).update(data);
    return { data: clientData, error };
  }

  async delete(collection: string, id: string) {
    const { data, error } = await this.client.from(collection).delete().eq("id", id);
    return { data, error };
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }
}

export default SupaBaseRepository;