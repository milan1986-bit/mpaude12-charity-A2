require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const SERVER_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Charity Events REST API - endpoints: /api/events, /api/categories, /api/events/search, /api/events/:id');
});

app.listen(SERVER_PORT, () => {
    console.log(`Charity Events API ready and listening on port ${SERVER_PORT}.`);
});
