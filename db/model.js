import { connect } from "../db/connect.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeQuery(pool, query) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results, ] = await connection.execute(query);
    console.log(results);
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await sleep(2000);
    if (connection) connection.release();
  }
}

const queries = [
  `SET FOREIGN_KEY_CHECKS = 0;`, // 🔹 Desactiva restricciones de clave foránea
  `DROP TABLE IF EXISTS ciudad;`,
  `DROP TABLE IF EXISTS departamento;`,
  `SET FOREIGN_KEY_CHECKS = 1;`, // 🔹 Reactiva restricciones de clave foránea

  `CREATE TABLE departamento (
    id TINYINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY nom (nom)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`,

  `CREATE TABLE ciudad (
    id SMALLINT(6) UNSIGNED NOT NULL AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    departamentoid TINYINT(3) UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY departamentoid (departamentoid),
    CONSTRAINT ciudad_departamento FOREIGN KEY (departamentoid) REFERENCES departamento (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`
];

for (let query of queries) {
  console.log(query);
  executeQuery(connect, query);
}