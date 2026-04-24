const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');

const courses = [
    {
        title: 'Full Stack Web Development with MERN',
        description: 'Master the MERN stack (MongoDB, Express, React, Node.js) to build complete, production-ready web applications from scratch. Covers REST APIs, authentication, and deployment.',
        price: 1999,
    },
    {
        title: 'React.js & Vite — Modern Frontend Development',
        description: 'Learn React 18 with hooks, context, React Router, and Vite for blazing-fast development. Build real-world SPAs with professional component architecture.',
        price: 1499,
    },
    {
        title: 'Node.js & Express — Backend Development',
        description: 'Build scalable backend services with Node.js and Express. Learn middleware, REST APIs, JWT authentication, file uploads, and MongoDB integration.',
        price: 1299,
    },
    {
        title: 'JavaScript — From Zero to Expert',
        description: 'A complete JavaScript course covering ES6+, async/await, closures, prototypes, DOM manipulation, and modern JavaScript design patterns used in the industry.',
        price: 999,
    },
    {
        title: 'Python for Web Development with Django',
        description: 'Learn Python web development using Django framework. Covers models, views, templates, forms, authentication, REST APIs with DRF, and PostgreSQL database.',
        price: 1799,
    },
    {
        title: 'DevOps & CI/CD for Developers',
        description: 'Understand Docker, Kubernetes, GitHub Actions, and cloud deployments. Learn to build automated pipelines and deploy apps on AWS and DigitalOcean.',
        price: 2499,
    },
    {
        title: 'Next.js 14 — Full Stack React Framework',
        description: 'Deep dive into Next.js with App Router, server components, server actions, Prisma ORM, and NextAuth. Build SEO-friendly full stack applications.',
        price: 1999,
    },
    {
        title: 'TypeScript for JavaScript Developers',
        description: 'Add type safety to your JavaScript projects with TypeScript. Learn interfaces, generics, enums, decorators, and integrating TypeScript with React and Node.js.',
        price: 1199,
    },
    {
        title: 'MongoDB & Database Design',
        description: 'Master MongoDB from the ground up — schema design, aggregation pipelines, indexing, transactions, and Mongoose for Node.js. Includes real-world data modeling patterns.',
        price: 899,
    },
    {
        title: 'Git & GitHub — Version Control Mastery',
        description: 'Learn Git from basics to advanced. Covers branching strategies, merge conflicts, rebasing, pull requests, GitHub Actions, and collaborating on open-source projects.',
        price: 499,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find or create a default instructor
        let instructor = await User.findOne({ role: 'instructor' });
        if (!instructor) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash('instructor123', salt);
            instructor = await User.create({
                name: 'EduHub Admin',
                email: 'admin@eduhub.com',
                password: hashed,
                role: 'instructor',
            });
            console.log('✅ Created default instructor: admin@eduhub.com / instructor123');
        } else {
            console.log(`✅ Using existing instructor: ${instructor.email}`);
        }

        // Remove old seeded courses (optional - comment this out to keep existing)
        await Course.deleteMany({});
        console.log('🗑️  Cleared existing courses');

        // Insert all courses with instructor ID
        const inserted = await Course.insertMany(
            courses.map(c => ({ ...c, instructor: instructor._id }))
        );
        console.log(`✅ Seeded ${inserted.length} courses successfully!`);

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        mongoose.disconnect();
    }
}

seed();
