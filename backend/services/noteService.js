import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

/*
   Required Supabase table: notes
   Columns:
     id           uuid  primary key default gen_random_uuid()
     customer_id  uuid  references customers(id) on delete cascade
     contact_id   uuid  references contacts(id) on delete cascade  nullable
     text         text  not null
     created_at   timestamptz default now()

   When contact_id is null the note belongs to the company.
   When contact_id is set the note belongs to that specific contact.
*/
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* =========================
   GET NOTES FOR A CUSTOMER OR CONTACT
   Pass contactId to get contact-specific notes.
   Pass null to get company-wide notes only.
========================= */
export const getNotes = async (customerId, contactId = null) => {
  let query = supabase
    .from("notes")
    .select("*")
    .eq("customer_id", customerId);

  if (contactId) {
    query = query.eq("contact_id", contactId);
  } else {
    query = query.is("contact_id", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/* =========================
   CREATE NOTE
========================= */
export const createNote = async (note) => {
  const { data, error } = await supabase
    .from("notes")
    .insert([note])
    .select();

  if (error) throw error;
  return data?.[0];
};

/* =========================
   DELETE NOTE
========================= */
export const deleteNote = async (id) => {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};
