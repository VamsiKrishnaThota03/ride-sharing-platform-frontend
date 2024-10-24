import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null); // State to hold user details

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleProfileClick = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5001/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserDetails(response.data);
            navigate('/profile'); // Navigate to the profile page
        } catch (error) {
            console.error('Error fetching user details:', error);
            // Handle error (e.g., show a notification)
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <Link className="navbar-brand" to="/">Ride Sharing Platform</Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    {!isLoggedIn && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">Signup</Link>
                            </li>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleProfileClick}>
                                    Profile
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <style jsx>{`
                .nav-link {
                    color: #ffffff; /* White text color for links */
                    transition: color 0.3s; /* Smooth color transition */
                    font-size: 1.2rem; /* Increase font size for nav links */
                    padding: 0.75rem 1rem; /* Adjust padding for vertical alignment */
                    display: flex; /* Ensure that flex is used for alignment */
                    align-items: center; /* Center the items vertically */
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
