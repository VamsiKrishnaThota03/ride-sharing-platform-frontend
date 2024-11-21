import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use environment variable for backend URL

    // Function to validate the form inputs
    const validateForm = () => {
        // Check if email is valid
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        // Check if password is provided
        if (!password) {
            setError("Password is required.");
            return false;
        }

        return true; // All validations passed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // Validate the form data
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        try {
            const response = await axios.post(`${backendUrl}/api/login`, { email, password }); // Use backendUrl
            const token = response.data.token;
            const role = response.data.role;

            // Store the token and role in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role); 
            localStorage.setItem('isLoggedIn', 'true');

            setIsLoggedIn(role);

            if (role === 'traveler') {
                navigate('/traveler-dashboard');
            } else if (role === 'traveler_companion') {
                const rideShareDetails = response.data.rideShareDetails;
                console.log(rideShareDetails);
                navigate('/companion-dashboard');
            } else if (role === 'admin') {
                navigate('/admin-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login. Please try again.');
        } finally {
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
