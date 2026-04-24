const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/:courseId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure enrolledCourses exists
        if (!user.enrolledCourses) user.enrolledCourses = [];

        console.log(`Enrollment attempt for user ${user.email}`);
        console.log(`Requested Course ID: ${req.params.courseId}`);
        console.log(`Current Enrolled IDs:`, user.enrolledCourses.map(id => id.toString()));

        // Check if already enrolled
        const isAlreadyEnrolled = user.enrolledCourses.some(
            id => id.toString() === req.params.courseId
        );

        if (isAlreadyEnrolled) {
            console.warn('User is already enrolled in this course.');
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        user.enrolledCourses.push(req.params.courseId);
        await user.save();
        
        console.log('Enrollment successful!');
        res.json({ message: "Enrollment successful", enrolledCourses: user.enrolledCourses });
    } catch (err) {
        console.error('Enrollment Error:', err);
        res.status(500).json({ message: "Server Error" });
    }
});

// UNENROLL ROUTE
router.delete('/:courseId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.enrolledCourses = user.enrolledCourses.filter(
            id => id.toString() !== req.params.courseId
        );
        
        await user.save();
        res.json({ message: "Unenrolled successfully", enrolledCourses: user.enrolledCourses });
    } catch (err) {
        console.error('Unenroll Error:', err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;