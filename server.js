const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend integration
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // Increased limit for base64 images

// Routes
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/admin', require('./routes/adminAuthRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Basic error handler mapping for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
