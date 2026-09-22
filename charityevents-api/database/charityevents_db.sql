-- charityevents_db schema + sample data
-- Run this in MySQL Workbench or the mysql CLI to set up the database.

DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db;
USE charityevents_db;

CREATE TABLE organisations (
    org_id       INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(150)  NOT NULL,
    mission      VARCHAR(500)  NOT NULL,
    description  TEXT,
    email        VARCHAR(150),
    phone        VARCHAR(30),
    website      VARCHAR(200),
    logo_url     VARCHAR(300),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id  INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    description  VARCHAR(255)
);
