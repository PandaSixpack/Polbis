const Program = require('../models/Program');

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
const getPrograms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.career) {
            query.careers = { $regex: req.query.career, $options: 'i' };
        }

        const sort = { createdAt: -1 };

        const programs = await Program.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalItems = await Program.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            data: programs,
            currentPage: page,
            totalPages,
            totalItems,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
const getProgram = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        res.status(200).json({ data: program });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Program not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create program
// @route   POST /api/admin/programs
// @access  Private (Admin)
const createProgram = async (req, res) => {
    try {
        const { id, title, description, highlights, image, link, curriculum, careers } = req.body;

        if (!id || !title || !description || !highlights || !image || !link || !curriculum || !careers) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const program = await Program.create({
            id,
            title,
            description,
            highlights,
            image,
            link,
            curriculum,
            careers,
            createdBy: req.admin.id
        });

        res.status(201).json({
            message: 'Program created successfully',
            data: program
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Program ID already exists' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update program
// @route   PUT /api/admin/programs/:id
// @access  Private (Admin)
const updateProgram = async (req, res) => {
    try {
        let program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        if (program.createdBy.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'Not authorized to update this program' });
        }

        program = await Program.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: 'Program updated successfully',
            data: program
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Program not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete program
// @route   DELETE /api/admin/programs/:id
// @access  Private (Admin)
const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        if (program.createdBy.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'Not authorized to delete this program' });
        }

        await program.deleteOne();

        res.status(200).json({ message: 'Program removed', id: req.params.id });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Program not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram
};
