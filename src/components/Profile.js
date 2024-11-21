import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use environment variable

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserDetails(response.data);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to fetch user details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [token, backendUrl]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p>Loading user profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-5" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>User Profile</h2>
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0" style={{ fontSize: '1.5rem' }}>User Name: {userDetails.name}</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        <li className="list-group-item" style={{ fontSize: '1.25rem' }}>
                            <strong>Email:</strong> {userDetails.email}
                        </li>
                        <li className="list-group-item" style={{ fontSize: '1.25rem' }}>
                            <strong>Mobile:</strong> {userDetails.mobile_number}
                        </li>
                        <li className="list-group-item" style={{ fontSize: '1.25rem' }}>
                            <strong>Role:</strong> {userDetails.role}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
