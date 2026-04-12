import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* =========================
   GET ALL CUSTOMERS
========================= */
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*");

  if (error) {
    console.error("GET ERROR:", error);
    throw error;
  }

  return data;
};

/* =========================
   CREATE CUSTOMER (FIXED + DEBUG)
========================= */
export const createCustomer = async (customer) => {


  const payload = {
    companyName: customer.companyName,
    companyEmail: customer.companyEmail,
    companyPhone: customer.companyPhone,
  };

  console.log("📦 PAYLOAD TO SUPABASE:", payload);

  const { data, error } = await supabase
    .from("customers")
    .insert([payload])
    .select();

  console.log("📊 SUPABASE RESPONSE DATA:", data);
  console.log("❌ SUPABASE RESPONSE ERROR:", error);

  if (error) {
    console.error("🔥 CREATE FAILED:", error);
    throw error;
  }

  return data?.[0];
};

/* =========================
   UPDATE CUSTOMER
========================= */
export const updateCustomer = async (id, customer) => {
  const payload = {
    companyName: customer.companyName,
    companyEmail: customer.companyEmail,
    companyPhone: customer.companyPhone,
  };

  const { data, error } = await supabase
    .from("customers")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    console.error("UPDATE ERROR:", error);
    throw error;
  }

  return data?.[0];
};

/* =========================
   DELETE CUSTOMER
========================= */
export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE ERROR:", error);
    throw error;
  }

  return true;
};