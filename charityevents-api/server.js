require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbPool = require('./event_db');

const app = express();
const SERVER_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// shared column list + joins for events, categories and organisations
const EVENT_SELECT_FIELDS = `
    e.event_id, e.name, e.short_summary, e.description, e.purpose,
    e.event_date, e.event_time, e.location, e.address, e.image_url,
    e.ticket_price, e.is_free, e.goal_amount, e.amount_raised, e.status,
    c.category_id, c.name AS category_name,
    o.org_id, o.name AS organisation_name, o.mission AS organisation_mission,
    o.description AS organisation_description, o.email AS organisation_email,
    o.phone AS organisation_phone, o.website AS organisation_website,
    o.logo_url AS organisation_logo
`;

const EVENT_TABLE_JOINS = `
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.org_id = o.org_id
`;

function mapEventRecord(row) {
    const todayIso = new Date().toISOString().slice(0, 10);
    const eventDateIso = new Date(row.event_date).toISOString().slice(0, 10);

    const fundraisingGoal = Number(row.goal_amount) || 0;
    const fundraisingRaised = Number(row.amount_raised) || 0;

    return {
        id: row.event_id,
        name: row.name,
        shortSummary: row.short_summary,
        description: row.description,
        purpose: row.purpose,
        date: eventDateIso,
        time: row.event_time,
        location: row.location,
        address: row.address,
        imageUrl: row.image_url,
        ticketPrice: Number(row.ticket_price),
        isFree: !!row.is_free,
        goalAmount: fundraisingGoal,
        amountRaised: fundraisingRaised,
        progressPercentage: fundraisingGoal > 0
            ? Math.min(100, Math.round((fundraisingRaised / fundraisingGoal) * 100))
            : 0,
        status: row.status,
        eventStatus: eventDateIso < todayIso ? 'past' : 'upcoming',
        category: {
            id: row.category_id,
            name: row.category_name
        },
        organisation: {
            id: row.org_id,
            name: row.organisation_name,
            mission: row.organisation_mission,
            description: row.organisation_description,
            email: row.organisation_email,
            phone: row.organisation_phone,
            website: row.organisation_website,
            logoUrl: row.organisation_logo
        }
    };
}

app.get('/api/events', (req, res) => {
    const listQuery = `
        SELECT ${EVENT_SELECT_FIELDS}
        ${EVENT_TABLE_JOINS}
        WHERE e.status = 'active' AND e.event_date >= CURDATE()
        ORDER BY e.event_date ASC, e.event_time ASC
    `;

    dbPool.query(listQuery)
        .then(([rows]) => {
            res.status(200).json(rows.map(mapEventRecord));
        })
        .catch((queryError) => {
            console.error('Homepage event query failed:', queryError.message);
            res.status(500).json({ error: 'Could not load events, try again shortly.' });
        });
});

app.get('/api/categories', (req, res) => {
    dbPool.query('SELECT category_id, name, description FROM categories ORDER BY name ASC')
        .then(([rows]) => {
            res.status(200).json(rows);
        })
        .catch((queryError) => {
            console.error('Category list query failed:', queryError.message);
            res.status(500).json({ error: 'Could not load categories.' });
        });
});

app.get('/', (req, res) => {
    res.send('Charity Events REST API - endpoints: /api/events, /api/categories, /api/events/search, /api/events/:id');
});

app.listen(SERVER_PORT, () => {
    console.log(`Charity Events API ready and listening on port ${SERVER_PORT}.`);
});
