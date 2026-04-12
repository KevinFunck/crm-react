import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customers", customerRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});