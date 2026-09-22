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

INSERT INTO organisations (name, mission, description, email, phone, website, logo_url) VALUES
('Hope & Harmony Foundation',
 'Raising funds and awareness to support families facing hardship in our community.',
 'Hope & Harmony Foundation is a local charitable organisation that has run community fundraising events for over a decade, channelling donations directly into housing, food relief and education programs.',
 'contact@hopeharmony.org', '(02) 5550 1234', 'https://www.hopeharmony.org',
 'images/org-hope-harmony.png'),
('Bright Futures Youth Trust',
 'Empowering young people through sport, arts and community events.',
 'Bright Futures Youth Trust organises inclusive community events that fund scholarships, mentoring and recreational programs for disadvantaged youth.',
 'hello@brightfutures.org', '(02) 5550 5678', 'https://www.brightfutures.org',
 'images/org-bright-futures.png');

INSERT INTO categories (name, description) VALUES
('Fun Run', 'Timed or untimed running/walking events for all fitness levels'),
('Gala Dinner', 'Formal dinner events with programs, speeches and auctions'),
('Silent Auction', 'Bid-based fundraising events for donated items and experiences'),
('Concert', 'Live music events held to raise funds for a cause'),
('Charity Walk', 'Community walking events supporting a specific cause'),
('Community Fair', 'Family-friendly fairs and markets raising funds for the community');
