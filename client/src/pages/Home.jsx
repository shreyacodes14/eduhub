import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/courses')
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home-container">
            {/* ── HERO SECTION ── */}
            <section className="hero-section">
                <div className="hero-badge">✨ Revolutionize Your Future</div>
                <h1>Unlock Your Full Potential <br/> With <span>EduHub</span></h1>
                <p>Join over 10,000+ students mastering in-demand skills from industry experts. Start your journey today.</p>
                <div className="hero-btns">
                    <Link to="/register" className="btn-primary-hero">Explore Courses</Link>
                    <Link to="/login" className="btn-secondary-hero">Join Now</Link>
                </div>
            </section>

            {/* ── COURSES SECTION ── */}
            <section className="home-courses-section">
                <div className="section-header">
                    <div>
                        <div className="card-category">Our Catalog</div>
                        <h2>Most Popular Courses</h2>
                    </div>
                    <Link to="/register" style={{color:'var(--primary)', fontWeight:'700', textDecoration:'none'}}>View All →</Link>
                </div>

                <div className="course-grid">
                    {courses.length === 0 ? (
                        <p>Loading amazing courses...</p>
                    ) : (
                        courses.slice(0, 6).map(course => (
                            <div key={course._id} className="course-card">
                                <div className="card-category">Development</div>
                                <h3>{course.title}</h3>
                                <p>{course.description.substring(0, 100)}...</p>
                                <div className="card-footer">
                                    <div className="price-tag">₹{course.price}</div>
                                    <Link to={`/course/${course._id}`} className="btn-details">View Details</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;