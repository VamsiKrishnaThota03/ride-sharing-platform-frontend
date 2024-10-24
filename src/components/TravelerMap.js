import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const TravelerMap = ({ tripId }) => {
    const [position, setPosition] = useState([28.6139, 77.2090]); // Initial position (Delhi)
    const [destination] = useState([17.385044, 78.486671]); // New destination (Hyderabad)
    const [estimatedTime] = useState(18000000); // Fixed estimated time in milliseconds (5 hours)
    const ws = useRef(null);
    const speed = 0.004; // Speed adjustment for movement (approx. 1 degree per 2.5 hours)

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Message not sent:', message);
        }
    };

    useEffect(() => {
        const connectWebSocket = () => {
            ws.current = new WebSocket(`ws://localhost:5001?tripId=${tripId}`);

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
                setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
            };
        };

        connectWebSocket();

        return () => {
            ws.current.close();
        };
    }, [tripId]);

    useEffect(() => {
        const interval = setInterval(() => {
            const latDiff = destination[0] - position[0];
            const lonDiff = destination[1] - position[1];
            const distance = Math.sqrt(latDiff ** 2 + lonDiff ** 2);

            if (distance < speed) {
                setPosition(destination); // Snap to destination
                clearInterval(interval);
                sendMessage({ type: 'destinationReached' });
                alert("Destination Reached");
            } else {
                const newLat = position[0] + (latDiff / distance) * speed;
                const newLon = position[1] + (lonDiff / distance) * speed;
                setPosition([newLat, newLon]);
                sendMessage({ type: 'updatePosition', lat: newLat, lon: newLon });
            }
        }, 100);

        return () => clearInterval(interval);
    }, [position, destination, speed]);

    const path = [position, destination];

    const handleShareLink = () => {
        const shareableLink = `http://localhost:3000/traveler-dashboard?tripId=${tripId}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error('Error copying link: ', err));
    };

    return (
        <div>
            <h2>Map for Trip ID: {tripId}</h2>
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
        </div>
    );
};

export default TravelerMap;
