function extractEventIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id ? Number(id) : null;
}

function formatEventDate(dateStr) {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatEventTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' });
}

function formatCurrency(amount) {
    return amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
}

function displayEventDetails(event) {
    const container = document.getElementById('event-details-container');
    document.title = `${event.name} - Hope & Harmony Charity Events`;

    const priceLabel = event.isFree ? 'Free entry' : `${formatCurrency(event.ticketPrice)} per ticket`;

    container.innerHTML = `
        <div class="event-hero" style="background-image:url('${event.imageUrl || ''}')">
            <div class="event-hero-overlay">
                <span class="category-tag">${event.category.name}</span>
                <h1>${event.name}</h1>
            </div>
        </div>

        <div class="event-detail-grid">
            <div>
                <div class="detail-card">
                    <h2>About this event</h2>
                    <p>${event.description}</p>
                    <p><strong>Purpose:</strong> ${event.purpose || 'Not specified.'}</p>
                </div>

                <div class="detail-card">
                    <h2>Event Details</h2>
                    <div class="info-row"><span class="label">Date</span><span>${formatEventDate(event.date)}</span></div>
                    <div class="info-row"><span class="label">Time</span><span>${formatEventTime(event.time)}</span></div>
                    <div class="info-row"><span class="label">Location</span><span>${event.location}</span></div>
                    <div class="info-row"><span class="label">Address</span><span>${event.address || 'N/A'}</span></div>
                    <div class="info-row"><span class="label">Status</span><span>${event.eventStatus === 'past' ? 'Past event' : 'Upcoming'}</span></div>
                </div>

                <div class="detail-card">
                    <h2>Hosted by</h2>
                    <div class="info-row"><span class="label">Organisation</span><span>${event.organisation.name}</span></div>
                    <div class="info-row"><span class="label">Mission</span><span>${event.organisation.mission}</span></div>
                    <div class="info-row"><span class="label">Contact</span><span>${event.organisation.email} &middot; ${event.organisation.phone}</span></div>
                </div>
            </div>

            <div>
                <div class="detail-card">
                    <h2>Tickets</h2>
                    <p class="ticket-price-lg">${priceLabel}</p>

                    <div class="progress-wrap">
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width:${event.progressPercentage}%"></div>
                        </div>
                        <div class="progress-labels">
                            <span>${formatCurrency(event.amountRaised)} raised</span>
                            <span>Goal: ${formatCurrency(event.goalAmount)}</span>
                        </div>
                    </div>

                    <form id="ticket-register-form" style="margin-top:18px;">
                        <div class="field">
                            <label for="guest-name">Full name</label>
                            <input type="text" id="guest-name" placeholder="Your name" required>
                        </div>
                        <div class="field">
                            <label for="guest-email">Email</label>
                            <input type="email" id="guest-email" placeholder="you@example.com" required>
                        </div>
                        <button type="submit" class="btn-primary" style="width:100%;">Register</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.getElementById('ticket-register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('registration-modal').hidden = false;
    });
}

function displayErrorState(message) {
    const container = document.getElementById('event-details-container');
    container.innerHTML = `<div class="error-state">${message} <a href="index.html">Return to Home</a></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    buildNavigation('');

    document.getElementById('dismiss-modal-btn').addEventListener('click', () => {
        document.getElementById('registration-modal').hidden = true;
    });

    const eventId = extractEventIdFromQuery();
    if (!eventId) {
        displayErrorState('No event was specified.');
        return;
    }

    CharityEventsService.fetchEventById(eventId)
        .then((event) => displayEventDetails(event))
        .catch((err) => displayErrorState(`We could not load this event. ${err.message}`));
});
