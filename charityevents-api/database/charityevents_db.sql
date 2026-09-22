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

-- events belongs to one organisation and one category
CREATE TABLE events (
    event_id       INT AUTO_INCREMENT PRIMARY KEY,
    org_id         INT NOT NULL,
    category_id    INT NOT NULL,
    name           VARCHAR(150) NOT NULL,
    short_summary  VARCHAR(255),
    description    TEXT NOT NULL,
    purpose        VARCHAR(500),
    event_date     DATE NOT NULL,
    event_time     TIME NOT NULL,
    location       VARCHAR(150) NOT NULL,
    address        VARCHAR(255),
    image_url      VARCHAR(300),
    ticket_price   DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    is_free        TINYINT(1)   NOT NULL DEFAULT 0,
    goal_amount    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    amount_raised  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status         ENUM('active','suspended') NOT NULL DEFAULT 'active',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_org
        FOREIGN KEY (org_id) REFERENCES organisations(org_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_events_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT
);
