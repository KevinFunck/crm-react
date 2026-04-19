import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

/*
   Required Supabase table: contacts
   Columns:
     id           uuid  primary key default gen_random_uuid()
     customer_id  uuid  references customers(id) on delete cascade
     name         text  not null
     email        text  not null
     phone        text
*/
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* =========================
   GET ALL CONTACTS (with company name)
========================= */
export const getAllContacts = async () => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*, customers(id, companyName)")
    .order("name");

  if (error) throw error;
  return data;
};

/* =========================
   GET CONTACTS FOR A CUSTOMER
========================= */
export const getContacts = async (customerId) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*, customers(id, companyName)")
    .eq("customer_id", customerId);

  if (error) throw error;
  return data;
};

/* =========================
   GET SINGLE CONTACT
========================= */
export const getContactById = async (id) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*, customers(id, companyName)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/* =========================
   CREATE CONTACT
========================= */
export const createContact = async (contact) => {
  const { data, error } = await supabase
    .from("contacts")
    .insert([contact])
    .select();

  if (error) throw error;
  return data?.[0];
};

/* =========================
   UPDATE CONTACT
========================= */
export const updateContact = async (id, fields) => {
  const { data, error } = await supabase
    .from("contacts")
    .update(fields)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data?.[0];
};

/* =========================
   DELETE CONTACT
========================= */
export const deleteContact = async (id) => {
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};
