import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css'; // Import custom CSS file

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use environment variable

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get(`${backendUrl}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(usersResponse.data);

                const feedbacksResponse = await axios.get(`${backendUrl}/api/admin/feedbacks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFeedbacks(feedbacksResponse.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching data');
            }
        };

        fetchData();
    }, [token, backendUrl]);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Users Section */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h3>Users</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        {users.length > 0 ? (
                            users.map(user => (
                                <div className="col-md-4 mb-3" key={user.id}>
                                    <div className="card shadow-sm custom-card">
                                        <div className="card-body">
                                            <h5 className="card-title large-text">{user.name}</h5>
                                            <p className="card-text large-text">
                                                <strong>ID:</strong> {user.id} <br />
                                                <strong>Email:</strong> {user.email} <br />
                                                <strong>Mobile Number:</strong> {user.mobile_number} <br />
                                                <strong>Role:</strong> {user.role} <br />
                                                <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()} <br />
                                                <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()} <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No users found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Feedbacks Section */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-success text-white">
                    <h3>Feedbacks</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        {feedbacks.length > 0 ? (
                            feedbacks.map(feedback => (
                                <div className="col-md-4 mb-3" key={feedback.id}>
                                    <div className="card shadow-sm custom-card">
                                        <div className="card-body">
                                            <h5 className="card-title large-text">Ride Share ID: {feedback.rideShareId}</h5>
                                            <p className="card-text large-text">
                                                <strong>User ID:</strong> {feedback.userId} <br />
                                                <strong>Rating:</strong> {feedback.rating} <br />
                                                <strong>Comment:</strong> {feedback.comment} <br />
                                                <strong>Created At:</strong> {new Date(feedback.createdAt).toLocaleString()} <br />
                                                <strong>Updated At:</strong> {new Date(feedback.updatedAt).toLocaleString()} <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No feedbacks found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
