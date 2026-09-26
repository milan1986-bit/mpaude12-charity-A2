function formatEventDate(dateStr) {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTicketPrice(event) {
    if (event.isFree) return 'Free entry';
    return `$${event.ticketPrice.toFixed(2)} per ticket`;
}

function createEventCard(event) {
    const card = document.createElement('a');
    card.className = 'event-card';
    card.href = `event.html?id=${event.id}`;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (event.imageUrl) {
        thumb.style.backgroundImage = `url('${event.imageUrl}')`;
    }

    const badge = document.createElement('span');
    badge.className = `badge ${event.eventStatus}`;
    badge.textContent = event.eventStatus === 'past' ? 'Past event' : 'Upcoming';
    thumb.appendChild(badge);

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `
        <span class="category-tag">${event.category.name}</span>
        <h3>${event.name}</h3>
        <div class="meta">
            <span>&#128197; ${formatEventDate(event.date)}</span>
            <span>&#128205; ${event.location}</span>
        </div>
        <span class="price">${formatTicketPrice(event)}</span>
    `;

    card.appendChild(thumb);
    card.appendChild(content);
    return card;
}

function displayEventList(events) {
    const listHost = document.getElementById('upcoming-events-list');
    const summaryEl = document.getElementById('upcoming-events-summary');
    listHost.innerHTML = '';

    if (events.length === 0) {
        listHost.innerHTML = '<div class="empty-state">There are no upcoming events right now. Please check back soon!</div>';
        summaryEl.textContent = '';
        return;
    }

    summaryEl.textContent = `${events.length} upcoming event${events.length === 1 ? '' : 's'}`;
    events.forEach((event) => listHost.appendChild(createEventCard(event)));
}

document.addEventListener('DOMContentLoaded', () => {
    buildNavigation('home');

    const listHost = document.getElementById('upcoming-events-list');
    listHost.innerHTML = '<div class="empty-state">Loading events...</div>';

    CharityEventsService.fetchUpcomingEvents()
        .then((events) => displayEventList(events))
        .catch((err) => {
            listHost.innerHTML = `<div class="error-state">Sorry, we could not load events right now. (${err.message})</div>`;
        });
});
