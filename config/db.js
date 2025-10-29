// config/db.js
import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure a proper folder exists for SQLite
const dbFolder = path.join(__dirname, "../database");
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

// Full path to the database file
const dbPath = path.join(dbFolder, "database.sqlite");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false, // Disable verbose logs
});

// Optional: test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ SQLite database connected successfully.");
  } catch (err) {
    console.error("❌ SQLite connection failed:", err.message);
  }
})();
