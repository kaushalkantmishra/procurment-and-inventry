import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes";
import poRoutes from "./routes/poRoutes";
import grnRoutes from "./routes/grnRoutes";
import receiptRoutes from "./routes/receiptRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import unitRoutes from "./routes/unitRoutes";
import warehouseRoutes from "./routes/warehouseRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/po", poRoutes);
app.use("/api/grn", grnRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/user", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
