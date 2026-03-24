import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); 

import { createClient } from "@supabase/supabase-js";

console.log("SERVICE URL:", process.env.SUPABASE_URL); // DEBUG

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const getCustomers = async () => {
  const { data, error } = await supabase.from("customers").select("*");
  if (error) throw error;
  return data;
};