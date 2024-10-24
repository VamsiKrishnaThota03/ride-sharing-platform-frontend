import React, { useState } from 'react';
import axios from 'axios';

const RideSharingForm = () => {
    const [tripId, setTripId] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [cabNumber, setCabNumber] = useState('');
    const [companionMobile, setCompanionMobile] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Hardcoded location for demonstration (replace with actual latitude/longitude)
    const driverLatitude = '37.7749'; 
    const driverLongitude = '-122.4194'; 

    const handleShareLink = async () => {
        if (!tripId || !driverName || !driverPhone || !cabNumber) {
            alert('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            // Post the ride details to the server
            const response = await axios.post('http://localhost:5001/api/rides/share', {
                tripId,
                driverName,
                driverPhone,
                cabNumber,
                companionMobile,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                }
            });

            alert(response.data.message);
            sendWhatsAppMessage(tripId, driverName, driverPhone, cabNumber, companionMobile, response.data.message);
            resetForm();
        } catch (error) {
            console.error('Error sharing ride:', error);
            alert('Error sharing ride. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sendWhatsAppMessage = (tripId, driverName, driverPhone, cabNumber, companionMobile, message) => {
        // Create the shareable link based on tripId
        const shareableLink = `http://localhost:3000/traveler-dashboard?tripId=${tripId}`;
        
        const fullMessage = `
            Ride Details:
            - Driver Name: ${driverName}
            - Driver Phone: ${driverPhone}
            - Cab Number: ${cabNumber}
            - Companion Mobile: ${companionMobile ? companionMobile : 'N/A'}
            - Additional Message: ${message}
            - Shareable Link: ${shareableLink}
            - Live Tracking Link: https://www.google.com/maps?q=${driverLatitude},${driverLongitude}
        `.trim();

        const whatsappMessage = encodeURIComponent(fullMessage);
        const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const resetForm = () => {
        setTripId('');
        setDriverName('');
        setDriverPhone('');
        setCabNumber('');
        setCompanionMobile('');
    };

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); handleShareLink(); }}>
            <h2>Share Ride</h2>
                <input
                    type="text"
                    placeholder="Trip ID"
                    value={tripId}
                    onChange={(e) => setTripId(e.target.value)}
                    required
                />
                <input 
                    type="text" 
                    placeholder="Driver Name" 
                    value={driverName} 
                    onChange={(e) => setDriverName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Driver Phone" 
                    value={driverPhone} 
                    onChange={(e) => setDriverPhone(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Cab Number" 
                    value={cabNumber} 
                    onChange={(e) => setCabNumber(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Companion Mobile Number" 
                    value={companionMobile} 
                    onChange={(e) => setCompanionMobile(e.target.value)} 
                />
                <button type="button" onClick={handleShareLink} disabled={loading}>
                    {loading ? 'Sharing Ride...' : 'Share Ride'}
                </button>
            </form>
        </div>
    );
};

export default RideSharingForm;
