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

-- 10 events: a mix of upcoming, past and one suspended (Midnight Poker Night)
-- so the home/search pages have something to filter against
INSERT INTO events
(org_id, category_id, name, short_summary, description, purpose, event_date, event_time,
 location, address, image_url, ticket_price, is_free, goal_amount, amount_raised, status)
VALUES
(1, 1, 'Sunrise City Fun Run 5K',
 'A 5km morning fun run through the city foreshore.',
 'Join hundreds of runners and walkers for a scenic 5km fun run along the city foreshore. Suitable for all ages and fitness levels, with a kids dash and post-run breakfast included.',
 'All proceeds fund emergency housing support for local families.',
 '2026-10-10', '07:00:00', 'Riverside Park, Sydney', '12 Riverside Ave, Sydney NSW',
 'images/event-funrun.jpg', 25.00, 0, 15000.00, 6250.00, 'active'),

(1, 2, 'Hope Gala Dinner 2026',
 'An elegant evening of dinner, live entertainment and auctions.',
 'A black-tie fundraising dinner featuring a three-course meal, live entertainment, guest speakers and a live auction, held in support of Hope & Harmony''s family housing program.',
 'Funds raised go directly towards transitional housing for families in crisis.',
 '2026-11-15', '18:30:00', 'Grand Ballroom, Hilton Sydney', '488 George St, Sydney NSW',
 'images/event-gala.jpg', 150.00, 0, 50000.00, 18400.00, 'active'),

(1, 3, 'Art for Hope Silent Auction',
 'Bid on donated artworks from local artists.',
 'Browse and bid on original artworks generously donated by local artists. Light refreshments provided. All artworks can be previewed online before the event.',
 'Proceeds support youth art and education programs.',
 '2026-10-25', '17:00:00', 'City Art Gallery', '1 Gallery Rd, Sydney NSW',
 'images/event-auction.jpg', 0.00, 1, 10000.00, 3120.00, 'active'),

(2, 4, 'Melodies for a Cause Concert',
 'An outdoor evening concert featuring local bands.',
 'An open-air concert featuring a line-up of local bands and artists performing to raise funds for youth mentoring programs. Food trucks and licensed bar on site.',
 'Ticket sales fund mentoring and scholarship programs for disadvantaged youth.',
 '2026-12-05', '19:00:00', 'Sydney Opera Forecourt', '2 Macquarie St, Sydney NSW',
 'images/event-concert.jpg', 45.00, 0, 20000.00, 4300.00, 'active'),

(2, 5, 'Community Wellness Walkathon',
 'A family-friendly 3km walk around Centennial Park.',
 'A relaxed, family-friendly 3km walk around Centennial Park promoting mental health and wellbeing. Free for children under 12, with entertainment and stalls at the finish line.',
 'Funds raised support youth mental health and wellbeing programs.',
 '2026-09-30', '08:30:00', 'Centennial Park', 'Centennial Park, Sydney NSW',
 'images/event-walk.jpg', 15.00, 0, 8000.00, 5200.00, 'active'),

(2, 6, 'Family Fun Fair',
 'A day of rides, stalls and entertainment for the whole family.',
 'A community fair with rides, market stalls, live performances and food vendors. A fun day out for the whole family while supporting a great cause.',
 'Proceeds fund recreational programs for young people in need.',
 '2026-10-18', '10:00:00', 'Parramatta Showground', '1 Showground Rd, Parramatta NSW',
 'images/event-fair.jpg', 10.00, 0, 12000.00, 2100.00, 'active'),

(1, 1, 'Winter Warmth Fun Run',
 'A cold-weather 5km community fun run.',
 'A crisp winter morning fun run through the Botanic Gardens, followed by a warm breakfast for all participants.',
 'Funds raised provided emergency winter relief supplies for families in need.',
 '2026-06-14', '08:00:00', 'Botanic Gardens', 'Mrs Macquaries Rd, Sydney NSW',
 'images/event-funrun.jpg', 20.00, 0, 9000.00, 9450.00, 'active'),

(2, 3, 'Spring Charity Auction',
 'A spring-themed silent auction of donated goods and experiences.',
 'A silent auction featuring donated experiences, vouchers and goods from local businesses, held to celebrate the start of spring.',
 'Proceeds supported scholarship places for the following school year.',
 '2026-05-20', '17:30:00', 'Parramatta Convention Centre', '5 Convention Way, Parramatta NSW',
 'images/event-auction.jpg', 0.00, 1, 7000.00, 7850.00, 'active'),

(2, 4, 'Youth Empowerment Concert',
 'An evening concert celebrating youth talent.',
 'A showcase concert featuring emerging young musicians, raising funds and awareness for youth empowerment programs across the city.',
 'Ticket proceeds fund youth leadership and empowerment workshops.',
 '2026-11-28', '19:30:00', 'State Theatre', '49 Market St, Sydney NSW',
 'images/event-concert.jpg', 35.00, 0, 18000.00, 2600.00, 'active'),

(1, 2, 'Midnight Poker Night',
 'A private late-night fundraising event.',
 'A late-night fundraising event that was found to be in breach of the organisation''s community event policy and has been suspended from public listing.',
 'N/A - event suspended pending review.',
 '2026-10-01', '21:00:00', 'Private Venue', 'Undisclosed',
 'images/event-gala.jpg', 100.00, 0, 5000.00, 0.00, 'suspended');
