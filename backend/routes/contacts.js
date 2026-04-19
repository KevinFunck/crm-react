import express from "express";
import {
  getAllContacts,
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contactService.js";

const router = express.Router();

/* ---------------------------
   GET ALL CONTACTS or filter by customer_id
--------------------------- */
router.get("/", async (req, res) => {
  try {
    const { customer_id } = req.query;
    const data = customer_id ? await getContacts(customer_id) : await getAllContacts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   GET SINGLE CONTACT
--------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const data = await getContactById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
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
