import express from "express";
import { getNotes, createNote, deleteNote } from "../services/noteService.js";

const router = express.Router();

/* ---------------------------
   GET NOTES
   Query params:
     customer_id (required)
     contact_id  (optional — omit to get company-wide notes)
--------------------------- */
router.get("/", async (req, res) => {
  try {
    const { customer_id, contact_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({ error: "customer_id query param is required" });
    }

    const data = await getNotes(customer_id, contact_id || null);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   CREATE NOTE
   Body: { customer_id, text, contact_id? }
   Omit contact_id to create a company-wide note.
--------------------------- */
router.post("/", async (req, res) => {
  try {
    const { customer_id, contact_id, text } = req.body;

    if (!customer_id || !text) {
      return res.status(400).json({ error: "customer_id and text are required" });
    }

    const data = await createNote({
      customer_id,
      contact_id: contact_id || null,
      text,
      created_at: new Date().toISOString(),
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   DELETE NOTE
   Params: id
--------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await deleteNote(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
