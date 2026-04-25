const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    namaLengkap: {
        type: String,
        required: [true, 'Nama lengkap wajib diisi']
    },
    email: {
        type: String,
        required: [true, 'Email wajib diisi'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Email tidak valid'
        ]
    },
    subjek: {
        type: String,
        required: [true, 'Subjek wajib diisi']
    },
    pesan: {
        type: String,
        required: [true, 'Pesan wajib diisi']
    },
    emailStatus: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    emailError: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
