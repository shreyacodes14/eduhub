const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET ALL COURSES
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// GET SINGLE COURSE BY ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE A COURSE
router.post('/', async (req, res) => {
    try {
        const { title, description, instructor, price } = req.body;
        const newCourse = new Course({ title, description, instructor, price });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;