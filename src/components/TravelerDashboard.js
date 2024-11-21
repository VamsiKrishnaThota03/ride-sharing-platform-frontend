import React from 'react';
import { useLocation } from 'react-router-dom';
import TravelerMap from './TravelerMap';
import RideSharingForm from './RideSharingForm';
import RideHistory from './RideHistory';
import './TravelerDashboard.css';

const TravelerDashboard = () => {
    const location = useLocation();

    // Function to extract the tripId from the URL query parameters
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tripId');
    };

    const tripId = getQueryParams(); // Get tripId from URL
    console.log(tripId)

    return (
        <div className="container mt-4">
            {/* Change heading based on tripId presence */}
            <h1>{tripId ? 'Traveler Live Location' : 'Traveler Dashboard'}</h1>
            <div className="row mb-4">
                {/* Traveler Map on the left side */}
                <div className="col-md-6">
                    <div className="traveler-map">
                        <TravelerMap />
                    </div>
                </div>
                {/* Conditional rendering based on tripId */}
                {!tripId ? (
                    // Show Ride Sharing Form if tripId is not present
                    <div className="col-md-6">
                        <div className="ride-sharing-form">
                            <RideSharingForm />
                        </div>
                    </div>
                ) : (
                    // Show shared rides if tripId is present
                    <div className="col-md-6">
                        <div className="shared-rides">
                            <RideHistory  /> {/* Pass tripId if needed */}
                        </div>
                    </div>
                )}
            </div>
            {/* Ride History displayed below the Map and Form */}
            
            <div className="row">
                <div className="col-12">
                    <div className="ride-history mt-4">
                        {!tripId ? (
                        // Show Ride Sharing Form if tripId is not present
                        // <div className="col-md-6">
                            <div className="ride-sharing-form">
                                <RideHistory />
                            {/* </div> */}
                        </div>
                        ) : (
                        // Show shared rides if tripId is present
                        <div className="col-md-6">
                            <div className="shared-rides">
                                {/* <RideHistory tripId={tripId} /> Pass tripId if needed */}
                            </div>
                        </div>
                        )}
                        {/* <RideHistory /> You may want to show ride history here without any filter */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelerDashboard;