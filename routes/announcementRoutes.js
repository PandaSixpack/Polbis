const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/announcementController');

// Public routes
router.route('/')
    .get(getAnnouncements);

router.route('/:id')
    .get(getAnnouncement);

// Admin routes
router.route('/admin')
    .post(protectAdmin, createAnnouncement);

router.route('/admin/:id')
    .put(protectAdmin, updateAnnouncement)
    .delete(protectAdmin, deleteAnnouncement);

module.exports = router;
