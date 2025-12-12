import dotenv from "dotenv";
import { createPool } from "mysql2/promise";

dotenv.config();

export const connect = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para reintentar conexión
const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await connect.getConnection();
      connection.release();
      console.log("Conectado a la base de datos");
      console.log("DB_USER:", process.env.DB_USER);
      console.log("DB_HOST:", process.env.DB_HOST);
      console.log("DB_NAME:", process.env.DB_NAME);
      return true;
    } catch (err) {
      console.error(`Intento ${i + 1}/${retries} - Error al conectar:`, err.message);
      if (i < retries - 1) {
        console.log(`Reintentando en ${delay / 1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error("No se pudo conectar a la base de datos después de varios intentos");
  process.exit(1);
};

// Ejecutar la función
connectWithRetry();
