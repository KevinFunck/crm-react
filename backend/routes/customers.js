import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/customerService.js";

const router = express.Router();

/* ---------------------------
   GET ALL CUSTOMERS
--------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await getCustomers();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      full: err
    });
  }
});

/* ---------------------------
   GET SINGLE CUSTOMER
--------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const data = await getCustomerById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/* ---------------------------
   CREATE CUSTOMER
--------------------------- */
router.post("/", async (req, res) => {
  try {

    // basic validation
    if (!req.body || !req.body.companyName) {
      return res.status(400).json({
        error: "companyName is required"
      });
    }

    const data = await createCustomer(req.body);

    res.status(200).json(data);
  } catch (err) {

    res.status(500).json({
      error: err.message,
      full: err
    });
  }
});

/* ---------------------------
   UPDATE CUSTOMER
--------------------------- */
router.put("/:id", async (req, res) => {
  try {

    const data = await updateCustomer(req.params.id, req.body);

    res.json(data);
  } catch (err) {
   
    res.status(500).json({
      error: err.message,
      full: err
    });
  }
});

/* ---------------------------
   DELETE CUSTOMER
--------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 DELETE ID:", req.params.id);

    await deleteCustomer(req.params.id);

    res.json({ success: true });
  } catch (err) {

    res.status(500).json({
      error: err.message,
      full: err
    });
  }
});

export default router;