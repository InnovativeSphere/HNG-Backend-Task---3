import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./config/db.js";
import countryRoutes from "./Routes/countryRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/countries", countryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🌍 Country Currency & Exchange API running" });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    await sequelize.sync({ alter: true });
    console.log("🗄️ Database synced.");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

startServer();
