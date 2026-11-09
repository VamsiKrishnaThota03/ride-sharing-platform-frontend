# Ride-Sharing Platform: Frontend

React client for a ride-safety sharing app: travelers share their cab details over WhatsApp, companions follow the trip on a map, and admins review users and feedback.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-react--leaflet-199900?logo=leaflet&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

## Live demo

https://ride-sharing-platform-frontend.vercel.app

## Overview

This is the standalone frontend of the Ride-Sharing Platform, built with Create React App. It talks to the [backend API](https://github.com/VamsiKrishnaThota03/ride-sharing-platform-backend) over REST and WebSockets. The backend address comes from the `REACT_APP_BACKEND_URL` environment variable.

### Related repositories

| Repository | What it contains |
|------------|------------------|
| [ride-sharing-platform-frontend](https://github.com/VamsiKrishnaThota03/ride-sharing-platform-frontend) | **This repo**: the React client, split out for deployment on Vercel |
| [ride-sharing-platform-backend](https://github.com/VamsiKrishnaThota03/ride-sharing-platform-backend) | Express + PostgreSQL + WebSocket API used by this client |
| [Ride-Sharing-Platform](https://github.com/VamsiKrishnaThota03/Ride-Sharing-Platform) | Original monorepo with the frontend and backend together (earlier, localhost-only version) |

## Features

**All users**
- Sign up as a Traveler, Traveler Companion or Admin, then log in. The JWT is stored in `localStorage`, and each role is sent to its own dashboard.
- A profile page and a navbar that loads the logged-in user's profile

**Traveler** (`/traveler-dashboard`)
- Share-ride form (trip ID, driver name, driver phone, cab number, companion mobile). It saves the ride through the API, then opens WhatsApp (`wa.me`) with a pre-filled message that includes a shareable trip link.
- "Your Shared Rides" history table, with a button to leave feedback on a ride
- Leaflet / OpenStreetMap view of the trip

**Traveler Companion** (`/companion-dashboard`)
- Cards for every ride shared with the companion's mobile number. The list refreshes every 10 seconds.
- Rides are shown as *Active* or *Expired* (expired = more than 60 minutes after the ride was shared)
- "View Map" for active trips and "Give Feedback" (rating 1–5 plus a comment)
- A notifications panel that listens on a WebSocket for `tripComplete` / `nearbyNotification` messages

**Admin** (`/admin-dashboard`)
- Tables of all registered users and all submitted feedback

### About the map

The trip map is a **simulation**. The marker moves in a straight line from a fixed start point (Delhi) to a fixed destination (Hyderabad). It shows a "Nearby Location Reached" banner when close and "Destination Reached" on arrival, and at that point it sends `destinationReached` over the WebSocket so the backend marks the trip inactive. It does not use live GPS.

## Tech stack

- React 18 (Create React App / `react-scripts` 5)
- React Router 6
- Axios
- Leaflet + react-leaflet with OpenStreetMap tiles
- moment-timezone
- Bootstrap / react-bootstrap (admin dashboard) and plain CSS

## Project structure

```
.
├── public/                 # index.html, icons, manifest
└── src/
    ├── App.js              # Routes
    ├── index.js
    └── components/
        ├── Login.js / Signup.js
        ├── Navbar.js / Profile.js
        ├── TravelerDashboard.js   # Map + share form + ride history
        ├── RideSharingForm.js     # Saves ride, opens WhatsApp share
        ├── RideHistory.js         # Shared rides + feedback
        ├── TravelerMap.js         # Simulated trip on Leaflet + WebSocket
        ├── CompanionDashboard.js  # Rides shared with the companion
        └── AdminDashboard.js      # Users and feedback
```

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A running instance of [ride-sharing-platform-backend](https://github.com/VamsiKrishnaThota03/ride-sharing-platform-backend)

### Install and run

```bash
git clone https://github.com/VamsiKrishnaThota03/ride-sharing-platform-frontend.git
cd ride-sharing-platform-frontend
npm install
npm start          # http://localhost:3000
```

### Environment variables

Create a `.env` file in the project root:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Base URL of the backend API (also used to build the WebSocket URL) | `http://localhost:5001` |
| `REACT_APP_FRONTEND_URL` | Optional. Public URL of this app, used for the "copy link" button on the map | `http://localhost:3000` |

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the development server |
| `npm run build` | Create a production build in `build/` |
| `npm test` | Run the CRA test runner |
| `npm run eject` | Eject from Create React App (one-way) |

## Routes

| Path | Page |
|------|------|
| `/` | Login |
| `/signup` | Sign up |
| `/traveler-dashboard` | Traveler dashboard (`?tripId=` shows a specific trip) |
| `/companion-dashboard` | Companion dashboard |
| `/admin-dashboard` | Admin dashboard |
| `/profile` | User profile |

## Contact

Thota Vamsi Krishna — [GitHub](https://github.com/VamsiKrishnaThota03)
