import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile_number: '', // Mobile number
        role: 'traveler', // Default role
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, email, password, mobile_number } = formData;
        
        // Check if name is provided
        if (!name) {
            alert("Name is required.");
            return false;
        }

        // Check if email is valid
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        // Check if password meets criteria (at least 6 characters)
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return false;
        }

        // Check if mobile number is valid (assuming it should be 10 digits)
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(mobile_number)) {
            alert("Please enter a valid mobile number (10 digits).");
            return false;
        }

        return true; // All validations passed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form data
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        console.log('Form Data:', formData); // Debug log to check form data
        try {
            const response = await axios.post('http://localhost:5001/api/signup', formData);
            console.log(response.data);
            alert("Signup successful!");
        } catch (error) {
            console.error("There was an error signing up:", error.response.data);
            alert("Signup failed: " + error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <input type="text" name="mobile_number" placeholder="Mobile Number" required onChange={handleChange} />
            <select name="role" value={formData.role} onChange={handleChange}>
                <option value="traveler">Traveler</option>
                <option value="traveler_companion">Traveler Companion</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
