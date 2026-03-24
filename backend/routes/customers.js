import express from "express";
import { getCustomers } from "../services/customerService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await getCustomers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;