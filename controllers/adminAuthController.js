const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password
        });

        const token = generateToken(admin._id);

        res.status(201).json({
            message: 'Admin registered successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            message: 'Admin logged in successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Public
const logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully. Please clear your token on the client side.' });
};

module.exports = {
    register,
    login,
    logout,
};
