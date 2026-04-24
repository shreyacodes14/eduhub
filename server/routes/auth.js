const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save User
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// GET CURRENT USER ROUTE
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// RESET ENROLLMENTS (DEBUG)
router.post('/clear-enrollments', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.enrolledCourses = [];
        await user.save();
        res.json({ message: "Enrollments cleared" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;