import express from "express";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contactService.js";

const router = express.Router();

/* ---------------------------
   GET ALL CONTACTS FOR A CUSTOMER
   Query param: customer_id (required)
--------------------------- */
router.get("/", async (req, res) => {
  try {
    const { customer_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({ error: "customer_id query param is required" });
    }

    const data = await getContacts(customer_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   CREATE CONTACT
   Body: { customer_id, name, email, phone? }
--------------------------- */
router.post("/", async (req, res) => {
  try {
    const { customer_id, name, email, phone } = req.body;

    if (!customer_id || !name || !email) {
      return res.status(400).json({ error: "customer_id, name and email are required" });
    }

    const data = await createContact({ customer_id, name, email, phone: phone || null });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   UPDATE CONTACT
   Params: id
   Body: { name?, email?, phone? }
--------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const data = await updateContact(req.params.id, { name, email, phone });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   DELETE CONTACT
   Params: id
--------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await deleteContact(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
