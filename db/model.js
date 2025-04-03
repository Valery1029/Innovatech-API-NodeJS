import { connect } from "../db/connect.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeQuery(pool, query) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query);
    console.log(results);
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await sleep(2000);
    if (connection) connection.release();
  }
}

const queries = [
  `CREATE TABLE IF NOT EXISTS api_users (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    api_user VARCHAR(60) NOT NULL,
    api_password VARCHAR(255) NOT NULL,
    api_role ENUM('Admin', 'Read-only') NOT NULL,
    api_status ENUM('Active', 'Inactive') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY api_user (api_user)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`
];

for (let query of queries) {
  console.log(query);
  executeQuery(connect, query);
}