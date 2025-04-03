CREATE DATABASE IF NOT EXISTS innovatechdb;
USE innovatechdb;

DROP TABLE IF EXISTS api_users;
CREATE TABLE IF NOT EXISTS api_users (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  api_user varchar(60) NOT NULL,
  api_password varchar(255) NOT NULL,
  api_role enum('Admin','Read-only') NOT NULL,
  api_status enum('Active','Inactive') NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY api_user (api_user)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;