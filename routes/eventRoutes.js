const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Public routes
router.route('/')
    .get(getEvents);

router.route('/:id')
    .get(getEvent);

// Admin routes
router.route('/admin')
    .post(protectAdmin, createEvent);

router.route('/admin/:id')
    .put(protectAdmin, updateEvent)
    .delete(protectAdmin, deleteEvent);

module.exports = router;
