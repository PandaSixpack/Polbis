const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement
} = require('../controllers/achievementController');

// Public routes
router.route('/')
    .get(getAchievements);

router.route('/:id')
    .get(getAchievement);

// Admin routes
router.route('/admin')
    .post(protectAdmin, createAchievement);

router.route('/admin/:id')
    .put(protectAdmin, updateAchievement)
    .delete(protectAdmin, deleteAchievement);

module.exports = router;
