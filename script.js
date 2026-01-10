// User's current location (will be set after geolocation)
let userLocation = null;

// Intent to place-type mapping
// This structure allows easy replacement with real API data later
const intentMapping = {
    'work': {
        placeTypes: ['coffee-shop', 'coworking-space', 'library', 'cafe'],
        displayName: 'Work'
    },
    'date': {
        placeTypes: ['restaurant', 'park', 'cinema', 'museum'],
        displayName: 'Date'
    },
    'quick-bite': {
        placeTypes: ['fast-food', 'cafe', 'food-court', 'bakery'],
        displayName: 'Quick Bite'
    },
    'budget': {
        placeTypes: ['affordable-restaurant', 'food-truck', 'market', 'cafe'],
        displayName: 'Budget'
    }
};

// Dummy data for places
// Structure: This can be easily replaced with API response data
const dummyPlaces = {
    'coffee-shop': [
        { name: 'Brew & Bean', rating: 4.5, distance: 0.8, isOpen: true },
        { name: 'Morning Coffee', rating: 4.2, distance: 1.2, isOpen: true },
        { name: 'The Roastery', rating: 4.7, distance: 2.1, isOpen: false }
    ],
    'coworking-space': [
        { name: 'WorkHub Central', rating: 4.6, distance: 1.5, isOpen: true },
        { name: 'Shared Space Co', rating: 4.4, distance: 2.3, isOpen: true },
        { name: 'The Office Lounge', rating: 4.3, distance: 0.9, isOpen: true }
    ],
    'library': [
        { name: 'City Central Library', rating: 4.8, distance: 1.8, isOpen: true },
        { name: 'Quiet Study Hall', rating: 4.5, distance: 2.5, isOpen: false }
    ],
    'cafe': [
        { name: 'Corner Cafe', rating: 4.3, distance: 0.5, isOpen: true },
        { name: 'Sunny Side Up', rating: 4.6, distance: 1.1, isOpen: true },
        { name: 'The Local Bean', rating: 4.4, distance: 1.7, isOpen: true }
    ],
    'restaurant': [
        { name: 'Fine Dining Co', rating: 4.7, distance: 1.2, isOpen: true },
        { name: 'Romantic Bistro', rating: 4.5, distance: 0.9, isOpen: true },
        { name: 'The Garden Restaurant', rating: 4.6, distance: 2.0, isOpen: false }
    ],
    'park': [
        { name: 'Central Park', rating: 4.9, distance: 0.7, isOpen: true },
        { name: 'Riverside Gardens', rating: 4.7, distance: 1.4, isOpen: true }
    ],
    'cinema': [
        { name: 'CineMax Theater', rating: 4.4, distance: 1.6, isOpen: true },
        { name: 'Star Cinema', rating: 4.3, distance: 2.2, isOpen: true }
    ],
    'museum': [
        { name: 'City Art Museum', rating: 4.8, distance: 2.5, isOpen: true },
        { name: 'History Center', rating: 4.6, distance: 1.9, isOpen: false }
    ],
    'fast-food': [
        { name: 'Quick Bites', rating: 4.2, distance: 0.4, isOpen: true },
        { name: 'Fast & Fresh', rating: 4.1, distance: 0.8, isOpen: true },
        { name: 'Grab & Go', rating: 4.0, distance: 1.3, isOpen: true }
    ],
    'food-court': [
        { name: 'Food Court Central', rating: 4.3, distance: 1.0, isOpen: true },
        { name: 'Market Square Eats', rating: 4.2, distance: 1.5, isOpen: true }
    ],
    'bakery': [
        { name: 'Sweet Treats Bakery', rating: 4.5, distance: 0.6, isOpen: true },
        { name: 'Fresh Bread Co', rating: 4.4, distance: 1.2, isOpen: false }
    ],
    'affordable-restaurant': [
        { name: 'Budget Bites', rating: 4.3, distance: 0.5, isOpen: true },
        { name: 'Value Meals', rating: 4.1, distance: 0.9, isOpen: true },
        { name: 'Economy Eats', rating: 4.2, distance: 1.4, isOpen: true }
    ],
    'food-truck': [
        { name: 'Tasty Truck', rating: 4.4, distance: 0.3, isOpen: true },
        { name: 'Street Food Express', rating: 4.3, distance: 0.7, isOpen: true }
    ],
    'market': [
        { name: 'Local Market', rating: 4.5, distance: 1.1, isOpen: true },
        { name: 'Fresh Market Square', rating: 4.4, distance: 1.8, isOpen: false }
    ]
};

// Get relevant places for a given intent
function getPlacesForIntent(intent) {
    const mapping = intentMapping[intent];
    if (!mapping) return [];

    // Collect all places from relevant place types
    const places = [];
    mapping.placeTypes.forEach(placeType => {
        if (dummyPlaces[placeType]) {
            places.push(...dummyPlaces[placeType]);
        }
    });

    // Sort by distance (closest first)
    return places.sort((a, b) => a.distance - b.distance);
}

// Create a place card element
function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';

    const name = document.createElement('h3');
    name.className = 'place-name';
    name.textContent = place.name;

    const info = document.createElement('div');
    info.className = 'place-info';

    // Rating
    const rating = document.createElement('div');
    rating.className = 'info-item';
    rating.innerHTML = `<span class="info-icon">⭐</span><span class="rating">${place.rating}</span>`;

    // Distance
    const distance = document.createElement('div');
    distance.className = 'info-item';
    distance.innerHTML = `<span class="info-icon">📍</span><span class="distance">${place.distance} km</span>`;

    // Status
    const status = document.createElement('div');
    status.className = 'info-item';
    const statusText = place.isOpen ? 'Open' : 'Closed';
    const statusClass = place.isOpen ? 'open' : 'closed';
    status.innerHTML = `<span class="info-icon">⏰</span><span class="status ${statusClass}">${statusText}</span>`;

    info.appendChild(rating);
    info.appendChild(distance);
    info.appendChild(status);

    card.appendChild(name);
    card.appendChild(info);

    return card;
}

// Display places in the results container
function displayPlaces(places) {
    const container = document.getElementById('resultsContainer');
    
    // Clear existing content
    container.innerHTML = '';

    if (places.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No places found for this intent</p>';
        return;
    }

    // Create and append place cards
    places.forEach(place => {
        const card = createPlaceCard(place);
        container.appendChild(card);
    });
}

// Update location status display
function updateLocationStatus(status, message) {
    const statusElement = document.getElementById('locationStatus');
    const textElement = statusElement.querySelector('.location-text');
    
    // Remove all status classes
    statusElement.classList.remove('success', 'error');
    
    if (status === 'loading') {
        statusElement.classList.remove('success', 'error');
        textElement.textContent = message || 'Requesting your location...';
    } else if (status === 'success') {
        statusElement.classList.add('success');
        textElement.textContent = message || 'Location found! Select an intent below.';
    } else if (status === 'error') {
        statusElement.classList.add('error');
        textElement.textContent = message || 'Unable to get your location. Please enable location access.';
    }
}

// Get user's location using Geolocation API
function getUserLocation() {
    updateLocationStatus('loading', 'Requesting your location...');
    
    if (!navigator.geolocation) {
        updateLocationStatus('error', 'Geolocation is not supported by your browser.');
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // Update status
            updateLocationStatus('success', `Location found! (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`);
            
            // Enable intent buttons
            enableIntentButtons();
            
            // Update placeholder text
            const container = document.getElementById('resultsContainer');
            container.innerHTML = '<p class="placeholder-text">Select an intent above to see nearby places</p>';
        },
        // Error callback
        (error) => {
            let errorMessage = 'Unable to get your location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please allow location access and refresh the page.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out. Please try again.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
                    break;
            }
            
            updateLocationStatus('error', errorMessage);
        },
        options
    );
}

// Enable intent buttons after location is obtained
function enableIntentButtons() {
    const intentCards = document.querySelectorAll('.intent-card');
    intentCards.forEach(card => {
        card.disabled = false;
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.cursor = 'pointer';
    });
}

// Handle intent button click
function handleIntentClick(event) {
    // Don't proceed if location hasn't been obtained
    if (!userLocation) {
        updateLocationStatus('error', 'Please wait for location access...');
        return;
    }

    const intentCard = event.currentTarget;
    const intent = intentCard.getAttribute('data-intent');

    // Remove active class from all intent cards
    document.querySelectorAll('.intent-card').forEach(card => {
        card.classList.remove('active');
    });

    // Add active class to clicked card
    intentCard.classList.add('active');

    // Get and display places for this intent
    const places = getPlacesForIntent(intent);
    displayPlaces(places);
}

// Initialize the app
function init() {
    // Request user's location first
    getUserLocation();
    
    // Add click event listeners to all intent cards
    const intentCards = document.querySelectorAll('.intent-card');
    intentCards.forEach(card => {
        card.addEventListener('click', handleIntentClick);
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

