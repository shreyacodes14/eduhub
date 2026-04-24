const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a lesson title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a lesson description']
    },
    videoUrl: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    resources: [
        {
            title: String,
            url: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lesson', lessonSchema);
