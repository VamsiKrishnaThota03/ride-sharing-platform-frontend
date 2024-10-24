import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import TravelerDashboard from './components/TravelerDashboard';
import CompanionDashboard from './components/CompanionDashboard';
import AdminDashboard from './components/AdminDashboard';
import TravelerMap from './components/TravelerMap';
import Profile from './components/Profile';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check localStorage for login status
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(storedIsLoggedIn);
    }, []);

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/traveler-dashboard" element={isLoggedIn ? <TravelerDashboard /> : <Login />} />
                    <Route path="/companion-dashboard" element={isLoggedIn ? <CompanionDashboard /> : <Login />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/map" component={TravelerMap} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
