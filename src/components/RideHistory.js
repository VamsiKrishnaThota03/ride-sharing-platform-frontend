import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RideHistory = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/rides/shared', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust for your auth method
                    }
                });
                setRides(response.data);
            } catch (error) {
                console.error('Error fetching rides:', error);
                setError('Failed to load ride history. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchRides();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Error state
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RideHistory;
