// Intent-based place finder using Foursquare API
let userLocation = null;

// Map user intents to Foursquare search queries
const intentQueries = {
    'work': 'coffee shop coworking',
    'date': 'romantic restaurant',
    'hotels': 'hotel accommodation',
    'restaurants': 'restaurant food'
};

// Fetch places from the serverless API
async function fetchPlaces(latitude, longitude, query) {
    try {
        const response = await fetch(`/api/places?ll=${latitude},${longitude}&query=${encodeURIComponent(query)}&limit=10`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Transform Foursquare API v2 response to our format
function transformPlace(venue, userLat, userLon) {
    // v2 API has location.lat/lng instead of geocodes.main
    const venueLat = venue.location?.lat || 0;
    const venueLon = venue.location?.lng || 0;
    const distance = venue.location?.distance || calculateDistance(userLat, userLon, venueLat, venueLon) * 1000; // v2 returns distance in meters

    return {
        name: venue.name || 'Unknown Place',
        rating: venue.rating ? (venue.rating / 2) : 4.0, // v2 uses 0-10 scale, convert to 0-5
        distance: (distance / 1000).toFixed(1), // Convert meters to km
        address: venue.location?.formattedAddress?.join(', ') || venue.location?.address || 'Address not available'
    };
}

function displayPlaces(places, isLoading = false) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    if (isLoading) {
        container.innerHTML = '<p class="placeholder-text">Loading nearby places...</p>';
        return;
    }

    if (places.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No places found. Try a different intent!</p>';
        return;
    }

    places.forEach(place => {
        const card = createPlaceCard(place);
        container.appendChild(card);
    });
}

function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';

    const name = document.createElement('h3');
    name.className = 'place-name';
    name.textContent = place.name;

    const info = document.createElement('div');
    info.className = 'place-info';

    const rating = document.createElement('div');
    rating.className = 'info-item';
    rating.innerHTML = `<span class="info-icon">⭐</span><span class="rating">${place.rating.toFixed(1)}</span>`;

    const distance = document.createElement('div');
    distance.className = 'info-item';
    distance.innerHTML = `<span class="info-icon">📍</span><span class="distance">${place.distance} km</span>`;

    const address = document.createElement('div');
    address.className = 'info-item';
    address.innerHTML = `<span class="info-icon">📮</span><span class="distance">${place.address}</span>`;

    info.appendChild(rating);
    info.appendChild(distance);
    info.appendChild(address);

    card.appendChild(name);
    card.appendChild(info);

    return card;
}

function updateLocationStatus(status, message) {
    const statusElement = document.getElementById('locationStatus');
    const textElement = statusElement.querySelector('.location-text');

    statusElement.classList.remove('success');

    if (status === 'success') {
        statusElement.classList.add('success');
    }

    textElement.textContent = message;
}

function getUserLocation() {
    updateLocationStatus('loading', 'Requesting your location...');

    if (!navigator.geolocation) {
        updateLocationStatus('error', 'Geolocation not supported');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            updateLocationStatus('success', `Location found! (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`);
            enableIntentButtons();
            displayPlaces([]);
        },
        (error) => {
            updateLocationStatus('error', 'Unable to get location. Please enable location access.');
        }
    );
}

function enableIntentButtons() {
    document.querySelectorAll('.intent-card').forEach(card => {
        card.classList.add('enabled');
    });
}

async function handleIntentClick(event) {
    if (!userLocation) return;

    const intentCard = event.currentTarget;
    const intent = intentCard.getAttribute('data-intent');

    document.querySelectorAll('.intent-card').forEach(card => {
        card.classList.remove('active');
    });
    intentCard.classList.add('active');

    displayPlaces([], true);

    try {
        // Get the search query for this intent
        const query = intentQueries[intent];

        // Fetch real places from the API
        const apiResults = await fetchPlaces(
            userLocation.latitude,
            userLocation.longitude,
            query
        );

        // Transform the results to our format
        const places = apiResults.map(place =>
            transformPlace(place, userLocation.latitude, userLocation.longitude)
        );

        displayPlaces(places);
    } catch (error) {
        console.error('Error loading places:', error);
        const container = document.getElementById('resultsContainer');
        container.innerHTML = '<p class="placeholder-text">Error loading places. Please try again.</p>';
    }
}

function init() {
    getUserLocation();

    document.querySelectorAll('.intent-card').forEach(card => {
        card.addEventListener('click', handleIntentClick);
    });
}

document.addEventListener('DOMContentLoaded', init);