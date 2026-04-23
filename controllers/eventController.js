const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: 'i' };
        }

        // Sorting by createdAt latest first as fallback for string date
        const sort = { createdAt: -1 };

        const events = await Event.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalItems = await Event.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            data: events,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ data: event });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create event
// @route   POST /api/admin/events
// @access  Private (Admin)
const createEvent = async (req, res) => {
    try {
        const { title, description, date, category, image } = req.body;

        if (!title || !description || !date || !category || !image) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const event = await Event.create({
            title,
            description,
            date,
            category,
            image,
            createdBy: req.admin.id
        });

        res.status(201).json({
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private (Admin)
const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only allow creator to update
        if (event.createdBy.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only allow creator to delete
        if (event.createdBy.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();

        res.status(200).json({ message: 'Event removed', id: req.params.id });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
};
