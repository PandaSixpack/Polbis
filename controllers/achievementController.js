const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering
        const query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.award) {
            query.award = { $regex: req.query.award, $options: 'i' };
        }

        // Sorting (latest first)
        const sort = { date: -1 };

        const achievements = await Achievement.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalItems = await Achievement.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            message: 'Achievements fetched successfully',
            data: achievements,
            currentPage: page,
            totalPages,
            totalItems,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
const getAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        res.status(200).json({
            message: 'Achievement fetched successfully',
            data: achievement
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create achievement
// @route   POST /api/admin/achievements
// @access  Private (Admin Only)
const createAchievement = async (req, res) => {
    try {
        const { title, description, image, award, date } = req.body;

        if (!title || !description || !image || !award || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const achievement = await Achievement.create({
            title,
            description,
            image,
            award,
            date,
            createdBy: req.admin.id
        });

        res.status(201).json({
            message: 'Achievement created successfully',
            data: achievement
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update achievement
// @route   PUT /api/admin/achievements/:id
// @access  Private (Admin Only)
const updateAchievement = async (req, res) => {
    try {
        let achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Authorization check
        if (achievement.createdBy.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'Not authorized to update this achievement' });
        }

        achievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Achievement updated successfully',
            data: achievement
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete achievement
// @route   DELETE /api/admin/achievements/:id
// @access  Private (Admin Only)
const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Authorization check
        if (achievement.createdBy.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'Not authorized to delete this achievement' });
        }

        await achievement.deleteOne();

        res.status(200).json({ message: 'Achievement removed', id: req.params.id });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement
};
