import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';

const TravelerMap = () => {
    const location = useLocation();

    // Extract tripId from URL query parameters
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tripId');
    };

    const tripId = getQueryParams(); // Get tripId from URL
    const [position, setPosition] = useState([28.6139, 77.2090]); // Initial position (Delhi)
    const [destination] = useState([17.385044, 78.486671]); // Destination (Hyderabad)
    const [estimatedTime] = useState(18000000); // Estimated time (5 hours)
    const ws = useRef(null);
    const speed = 0.04; // Speed adjustment
    const [alerted, setAlerted] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); // Alert message state

    // Send message over WebSocket
    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Message not sent:', message);
        }
    };

    // Connect to WebSocket server
    useEffect(() => {
        const connectWebSocket = () => {
            if (tripId) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
                ws.current = new WebSocket(`${backendUrl}/?tripId=${tripId}`);

                ws.current.onopen = () => {
                    console.log('WebSocket connection established');
                    sendMessage({ type: 'initialPosition', lat: position[0], lon: position[1] });
                };

                ws.current.onmessage = (event) => {
                    const newPosition = JSON.parse(event.data);
                    setPosition([newPosition.lat, newPosition.lon]);
                };

                ws.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                ws.current.onclose = () => {
                    console.log('WebSocket connection closed. Attempting to reconnect...');
                    setTimeout(connectWebSocket, 1000); // Try reconnecting
                };
            } else {
                console.warn('No tripId provided. WebSocket connection not established.');
            }
        };

        connectWebSocket();

        return () => {
            if (ws.current) ws.current.close();
        };
    }, [tripId, position]);

    // Update position every 100ms
    useEffect(() => {
        const interval = setInterval(() => {
            const latDiff = destination[0] - position[0];
            const lonDiff = destination[1] - position[1];
            const distance = Math.sqrt(latDiff ** 2 + lonDiff ** 2);

            if (distance <= 5 && !alerted) {
                setAlertMessage('Nearby Location Reached'); // Set alert
                setAlerted(true); // Trigger alert once
            }

            if (distance < speed) {
                setPosition(destination); // Snap to destination
                clearInterval(interval);
                sendMessage({ type: 'destinationReached' });
                setAlertMessage('Destination Reached'); // Set destination reached message
            } else {
                const newLat = position[0] + (latDiff / distance) * speed;
                const newLon = position[1] + (lonDiff / distance) * speed;
                setPosition([newLat, newLon]);
                sendMessage({ type: 'updatePosition', lat: newLat, lon: newLon });
            }
        }, 100);

        return () => clearInterval(interval); // Cleanup interval
    }, [position, destination, speed, alerted]);

    // Path for polyline
    const path = [position, destination];

    // Handle share link generation
    const handleShareLink = () => {
        const shareableLink = `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/traveler-dashboard?tripId=${tripId}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Error copying link: ', err));
    };

    return (
        <div>
            {tripId ? <h2>Map for Trip ID: {tripId}</h2> : <h2>Map View</h2>}

            <MapContainer center={position} zoom={6} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline positions={path} color="red" />
                <Marker position={position} icon={new L.Icon.Default()}>
                    <Popup>Traveler is here.</Popup>
                </Marker>
                <Marker position={destination} icon={new L.Icon.Default()}>
                    <Popup>Destination (Hyderabad).</Popup>
                </Marker>
                <div className="leaflet-control-zoom leaflet-bar leaflet-control leaflet-control-zoom" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                    <a href="#" className="leaflet-control-zoom-in" title="Zoom in" aria-label="Zoom in">+</a>
                    <a href="#" className="leaflet-control-zoom-out" title="Zoom out" aria-label="Zoom out">-</a>
                </div>
            </MapContainer>

            <div style={{ marginTop: '20px' }}>
                <p>Estimated Time to Destination: {(estimatedTime / 60000).toFixed(2)} minutes</p>
            </div>

            {/* Display alert message */}
            {alertMessage && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '10px', border: '1px solid black', zIndex: 1000 }}>
                    {alertMessage}
                </div>
            )}

            <button onClick={handleShareLink} style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                Share Trip Link
            </button>
        </div>
    );
};

export default TravelerMap;
