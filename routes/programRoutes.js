const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram
} = require('../controllers/programController');

// Public routes
router.route('/')
    .get(getPrograms);

router.route('/:id')
    .get(getProgram);

// Admin routes
router.route('/admin')
    .post(protectAdmin, createProgram);

router.route('/admin/:id')
    .put(protectAdmin, updateProgram)
    .delete(protectAdmin, deleteProgram);

module.exports = router;
