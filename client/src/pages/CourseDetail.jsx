import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById, enrollCourse, unenrollCourse, getCurrentUser } from '../api';
import '../App.css';

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const courseRes = await getCourseById(id);
            setCourse(courseRes.data);

            const token = localStorage.getItem('token');
            if (token) {
                const userRes = await getCurrentUser();
                const enrolled = userRes.data.enrolledCourses?.some(cId => cId.toString() === id);
                setIsEnrolled(enrolled);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollAction = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Login to enrol");
            navigate('/login');
            return;
        }

        try {
            if (isEnrolled) {
                if (window.confirm('Unenroll from this course?')) {
                    await unenrollCourse(id);
                    setIsEnrolled(false);
                }
            } else {
                await enrollCourse(id);
                setIsEnrolled(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    if (loading) return <div className="content-container">Loading...</div>;
    if (!course) return <div className="content-container">Course not found</div>;

    return (
        <div className="content-container">
            <Link to="/dashboard" className="back-btn" style={{ textDecoration: 'none', color: '#64748b' }}>← Back to Dashboard</Link>

            <div style={{ marginTop: '30px' }}>
                <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.8rem' }}>COURSE DETAILS</span>
                <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{course.title}</h1>
                <p style={{ color: '#64748b' }}>Instructor: {course.instructor?.name || 'EduHub'}</p>
            </div>

            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '30px' }}>
                <h2 style={{ marginBottom: '15px' }}>About this course</h2>
                <p>{course.description}</p>
            </div>

            <div style={{ marginTop: '30px', padding: '25px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ display: 'block', color: '#64748b', fontSize: '0.9rem' }}>Price</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{course.price}</span>
                </div>
                <button 
                    className="btn-submit" 
                    style={{ width: 'auto', padding: '12px 40px', background: isEnrolled ? '#ef4444' : '#2563eb' }} 
                    onClick={handleEnrollAction}
                >
                    {isEnrolled ? 'Unenroll' : 'Enroll Now'}
                </button>
            </div>
        </div>
    );
}

export default CourseDetail;