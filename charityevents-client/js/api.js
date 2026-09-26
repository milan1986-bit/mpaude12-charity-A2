function requestJSON(path) {
    return fetch(`${API_ROOT_URL}${path}`)
        .then((response) => {
            if (!response.ok) {
                return response.json()
                    .catch(() => ({}))
                    .then((body) => {
                        throw new Error(body.error || `Request failed with status ${response.status}`);
                    });
            }
            return response.json();
        });
}

const CharityEventsService = {
    fetchUpcomingEvents: () => requestJSON('/events'),
    fetchEventCategories: () => requestJSON('/categories'),
    searchEventsByCriteria: (criteria) => {
        const query = new URLSearchParams();
        Object.keys(criteria).forEach((key) => {
            if (criteria[key]) {
                query.append(key, criteria[key]);
            }
        });
        const qs = query.toString();
        return requestJSON(`/events/search${qs ? `?${qs}` : ''}`);
    },
    fetchEventById: (eventId) => requestJSON(`/events/${eventId}`)
};
