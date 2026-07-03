import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to Postgres");
});

pool.on("error", (err) => {
  console.error("Postgres connection error", err);
});

export default pool;
