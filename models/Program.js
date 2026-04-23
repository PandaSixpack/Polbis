const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add a unique ID'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    highlights: {
        type: [String],
        required: [true, 'Please add highlights']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    link: {
        type: String,
        required: [true, 'Please add a link']
    },
    curriculum: {
        type: [String],
        required: [true, 'Please add curriculum']
    },
    careers: {
        type: [String],
        required: [true, 'Please add careers']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
