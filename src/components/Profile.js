import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [token]);

    if (!userDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>User Profile</h2>
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0" style={{ fontSize: '1.5rem' }}>UserName:{userDetails.name}</h5>
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
