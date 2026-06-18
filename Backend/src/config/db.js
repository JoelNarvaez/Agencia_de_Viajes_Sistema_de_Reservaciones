import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config({ override: true });

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 33064,
});

console.log("ENV:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.promise().getConnection()
  .then(() => console.log("MySQL conectado"))
  .catch((err) => console.error("Error MySQL:", err.message));

export default pool.promise();
