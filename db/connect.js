import { createPool } from "mysql2/promise";

export const connect = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'innovatech_prueba',
  port: '3306',
})