const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
    try {
        // Pagination setup
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting & Filtering
        const priorityFilter = req.query.priority ? { priority: req.query.priority } : {};
        const sortOption = { date: -1 }; // latest first

        // Query execution
        const announcements = await Announcement.find(priorityFilter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
        
        // Count total documents for pagination metadata
        const totalItems = await Announcement.countDocuments(priorityFilter);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            data: announcements,
            currentPage: page,
            totalPages,
            totalItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single announcement by ID
// @route   GET /api/announcements/:id
// @access  Public
const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json(announcement);
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Public
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, date, priority } = req.body;

        if (!title || !content || !date) {
            return res.status(400).json({ message: 'Please provide all required fields (title, content, date)' });
        }

        const announcement = await Announcement.create({
            title,
            content,
            date,
            priority
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Public
const updateAnnouncement = async (req, res) => {
    try {
        let announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(announcement);
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Public
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await announcement.deleteOne();

        res.status(200).json({ message: `Deleted announcement ${req.params.id}`, id: req.params.id });
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
