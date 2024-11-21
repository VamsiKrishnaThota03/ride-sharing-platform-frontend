import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [role, setRole] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use environment variable

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleProfileClick = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${backendUrl}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserDetails(response.data);
            navigate('/profile', { state: { userDetails: response.data } }); // Pass data to profile page
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleDashboardClick = () => {
        if (role === 'traveler') {
            navigate('/traveler-dashboard');
        } else if (role === 'traveler_companion') {
            navigate('/companion-dashboard');
        } else if (role === 'admin') {
            navigate('/admin-dashboard');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ padding: '0.5rem 1rem' }}>
            <Link className="navbar-brand" to="/" style={{ fontSize: '1.5rem' }}>
                Ride Sharing Platform
            </Link>
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
                    {!isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">
                                    Signup
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleProfileClick}>
                                    Profile
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleDashboardClick}>
                                    Dashboard
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/traveler-dashboard')}>
                                    Share Ride
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
                    color: #ffffff;
                    font-size: 1.2rem;
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    transition: color 0.3s;
                }
                .nav-link:hover {
                    color: #00c4ff;
                }
                .navbar-brand {
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .btn-link {
                    text-decoration: none;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
