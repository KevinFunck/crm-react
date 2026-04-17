import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers.js";
import contactRoutes from "./routes/contacts.js";
import noteRoutes from "./routes/notes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------------------
   Routes
--------------------------- */
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/contacts", contactRoutes);
app.use("/notes", noteRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
