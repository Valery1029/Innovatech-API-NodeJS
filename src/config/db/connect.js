import dotenv from "dotenv";
import { createPool } from "mysql2/promise";

dotenv.config();

export const connect = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connect.getConnection()
  .then(() => {
    console.log("✅ Conectado a la base de datos");
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_NAME:", process.env.DB_NAME);
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err.message);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_NAME:", process.env.DB_NAME);
  });
