import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment-timezone'; // Import moment-timezone
import './CompanionDashboard.css'; // Importing external CSS

const CompanionDashboard = () => {
    const [rideShares, setRideShares] = useState([]);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const timeZone = 'America/New_York'; // Set your desired time zone here
    const navigate = useNavigate(); // Use the useNavigate hook

    const fetchRideShares = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/rides/companion/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const sortedRides = response.data.sort((a, b) => moment(b.createdAt) - moment(a.createdAt)); // Sort rides by createdAt
            setRideShares(sortedRides);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Something went wrong');
        }
    };

    const handleFeedbackSubmit = async (ride) => {
        const rating = window.prompt("Please enter your rating (1 to 5):");
        const comment = window.prompt("Please enter your comment:");

        if (!rating || !comment) {
            alert("Feedback not submitted. Please provide both rating and comment.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/feedback/send', {
                rideShareId: ride.tripId,
                rating: parseInt(rating, 10),
                comment: comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Feedback submitted successfully!');
        } catch (err) {
            alert('Failed to submit feedback: ' + (err.response ? err.response.data.message : 'Something went wrong'));
        }
    };

    useEffect(() => {
        fetchRideShares();

        const interval = setInterval(() => {
            fetchRideShares();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5001');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'tripComplete') {
                setNotifications((prev) => [...prev, data.message]);
            }
            if (data.type === 'nearbyNotification') {
                setNotifications((prev) => [...prev, data.message]);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    // Function to check if the ride has expired
    const isRideExpired = (createdAt) => {
        const createdAtMoment = moment(createdAt).tz(timeZone);
        const expiryDuration = 60; // Set your expiry duration in minutes
        const expiryTime = createdAtMoment.clone().add(expiryDuration, 'minutes');
        return moment().tz(timeZone).isAfter(expiryTime);
    };

    return (
        <div className="dashboard-container">
            <h1>Companion Dashboard</h1>
            {error && <p className="error">{error}</p>}
            {notifications.length > 0 && (
                <div className="notifications">
                    <h2>Notifications</h2>
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index}>{notification}</li>
                        ))}
                    </ul>
                </div>
            )}
            {rideShares.length === 0 ? (
                <p>No ride share details available.</p>
            ) : (
                <div className="ride-cards">
                    {rideShares.map((ride) => (
                        <div key={ride.id} className={`ride-card ${isRideExpired(ride.createdAt) ? 'expired' : 'active'}`}>
                            <h3>Trip ID: {ride.tripId}</h3>
                            <p><strong>Driver Name:</strong> {ride.driverName}</p>
                            <p><strong>Driver Phone:</strong> {ride.driverPhone}</p>
                            <p><strong>Cab Number:</strong> {ride.cabNumber}</p>
                            <p><strong>Companion Mobile:</strong> {ride.companionMobile}</p>
                            <p><strong>Created At:</strong> {moment(ride.createdAt).tz(timeZone).format('YYYY-MM-DD HH:mm:ss')}</p>
                            <p className={`status ${isRideExpired(ride.createdAt) ? 'expired' : 'active'}`}>
                                Status: {isRideExpired(ride.createdAt) ? 'Expired' : 'Active'}
                            </p>
                            <button className="feedback-button" onClick={() => handleFeedbackSubmit(ride)}>
                                Give Feedback
                            </button>
                            {/* Conditionally render the map link as a button based on ride status */}
                            {!isRideExpired(ride.createdAt) && (
                                <button 
                                    className="map-button" 
                                    onClick={() => navigate(`/traveler-dashboard?tripId=${ride.tripId}`)} // Navigate to the trip map
                                >
                                    View Map for Trip ID {ride.tripId}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanionDashboard;
