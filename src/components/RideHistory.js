import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RideHistory = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/rides/shared`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setRides(response.data);
            } catch (error) {
                console.error('Error fetching rides:', error);
                setError('Failed to load ride history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    const handleFeedbackSubmit = async (ride) => {
        const rating = window.prompt("Please enter your rating (1 to 5):");
        const comment = window.prompt("Please enter your comment:");

        if (!rating || !comment) {
            alert("Feedback not submitted. Please provide both rating and comment.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/feedback/send`, {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ margin: '20px' }}>
            <h2>Your Shared Rides</h2>
            {rides.length === 0 ? (
                <p>No rides found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Trip ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Driver Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Driver Phone</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cab Number</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date Shared</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Feedback</th> {/* New column for feedback */}
                        </tr>
                    </thead>
                    <tbody>
                        {rides.map((ride) => (
                            <tr key={ride.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ride.tripId}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ride.driverName}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ride.driverPhone}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ride.cabNumber}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(ride.createdAt).toLocaleString()}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <button onClick={() => handleFeedbackSubmit(ride)}>Give Feedback</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RideHistory;
