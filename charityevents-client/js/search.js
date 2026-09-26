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

function displayFeedback(text, kind) {
    const box = document.getElementById('search-feedback');
    box.innerHTML = '';
    if (!text) return;

    const div = document.createElement('div');
    div.className = `form-message ${kind}`;
    div.textContent = text;
    box.appendChild(div);
}

function displaySearchResults(events) {
    const listHost = document.getElementById('search-results-list');
    const summaryEl = document.getElementById('search-results-summary');
    listHost.innerHTML = '';

    if (events.length === 0) {
        listHost.innerHTML = '';
        summaryEl.textContent = '';
        displayFeedback('No events matched your search. Try adjusting or clearing your filters.', 'error');
        return;
    }

    displayFeedback('', '');
    summaryEl.textContent = `${events.length} event${events.length === 1 ? '' : 's'} found`;
    events.forEach((event) => listHost.appendChild(createEventCard(event)));
}

function populateCategoryOptions() {
    const select = document.getElementById('search-category');
    return CharityEventsService.fetchEventCategories()
        .then((categories) => {
            categories.forEach((category) => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(() => {
            displayFeedback('Could not load event categories. You can still search by date/location.', 'error');
        });
}

function performEventSearch() {
    const date = document.getElementById('search-date').value;
    const location = document.getElementById('search-location').value.trim();
    const category = document.getElementById('search-category').value;

    if (!date && !location && !category) {
        displayFeedback('Please enter at least one search criteria: date, location or category.', 'error');
        document.getElementById('search-results-list').innerHTML = '';
        document.getElementById('search-results-summary').textContent = '';
        return;
    }

    document.getElementById('search-results-list').innerHTML = '<div class="empty-state">Searching...</div>';

    CharityEventsService.searchEventsByCriteria({ date, location, category })
        .then((events) => displaySearchResults(events))
        .catch((err) => {
            document.getElementById('search-results-list').innerHTML = '';
            document.getElementById('search-results-summary').textContent = '';
            displayFeedback(`Something went wrong while searching: ${err.message}`, 'error');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    buildNavigation('search');
    populateCategoryOptions();

    const searchForm = document.getElementById('event-search-form');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        performEventSearch();
    });

    document.getElementById('reset-search-btn').addEventListener('click', () => {
        searchForm.reset();
        displayFeedback('', '');
        document.getElementById('search-results-list').innerHTML = '';
        document.getElementById('search-results-summary').textContent = '';
    });
});
