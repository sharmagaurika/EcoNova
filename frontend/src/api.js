// Contains snapshots of user transportation info every time
// the API fetches new information
const positions = [];
let watchId = null;

// Add an eventlistener to start and stop fetching location data
document.getElementById("track-begins").addEventListener('click', startTracking);
document.getElementById("track-ends").addEventListener('click', stopTracking);

function startTracking(event) {
    // Constantly watch for new information and place it in the array
    const watchId = navigator.geolocation.watchPosition((position) => {
    positions.push({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
        timestamp: position.timestamp
        });
    });
}

function stopTracking() {
    navigator.geolocation.clearWatch(watchId);
    // Send the information array to the backend
    sendToBackend(positions);
}