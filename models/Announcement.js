const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
