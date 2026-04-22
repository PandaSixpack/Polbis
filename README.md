# Polbis Backend - Announcements API

This is the backend for the Polbis university project, built with Node.js, Express.js, and MongoDB. It provides a RESTful API for managing announcements.

## Features
- Full CRUD operations for Announcements.
- Pagination for the announcements list.
- Sorting by date (latest first).
- Filtering by priority (low, normal, high).
- Environment variables support with `dotenv`.
- CORS enabled for frontend integration.

## Project Structure
```text
/
├── config/
│   └── db.js                # Database connection configuration
├── controllers/
│   └── announcementController.js # Logic for announcement endpoints
├── models/
│   └── Announcement.js      # Mongoose model for Announcements
├── routes/
│   └── announcementRoutes.js # Express routes for Announcements
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment variables
├── package.json             # Project dependencies and scripts
├── seeder.js                # Script to seed sample data
└── server.js                # Entry point of the application
```

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB installed and running locally.

### 2. Install Dependencies
Run the following command to install the required packages:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following variables (you can copy from `.env.example`):
```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/polbis
```

### 4. Seed Sample Data
To populate the database with initial sample data, run:
```bash
npm run data:import
```

### 5. Run the Project
Start the server in development mode:
```bash
npm run dev
```
The server will be running at `http://localhost:5000`.

## API Endpoints

### Announcements
- **GET /api/announcements**
  - Fetch all announcements with pagination.
  - Query params: `page` (default 1), `limit` (default 10), `priority` (optional).
- **GET /api/announcements/:id**
  - Fetch a single announcement by ID.
- **POST /api/announcements**
  - Create a new announcement.
  - Body: `{ "title", "content", "date", "priority" }`
- **PUT /api/announcements/:id**
  - Update an announcement by ID.
- **DELETE /api/announcements/:id**
  - Delete an announcement by ID.
