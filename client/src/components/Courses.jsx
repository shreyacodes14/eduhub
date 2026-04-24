import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, enrollCourse } from '../api';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAllCourses();
                setCourses(response.data.courses);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleEnroll = async (courseId) => {
        try {
            await enrollCourse(courseId);
            alert('Enrolled successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        }
    };

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="courses-container">
            <h2>Available Courses</h2>
            {courses.length === 0 ? (
                <p>No courses available yet.</p>
            ) : (
                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course._id} className="course-card">
                            <h3>{course.title}</h3>
                            <p><strong>Category:</strong> {course.category}</p>
                            <p><strong>Price:</strong> ${course.price}</p>
                            <p>{course.description}</p>
                            <p><strong>Instructor:</strong> {course.instructor.name}</p>
                            <p><strong>Students:</strong> {course.students.length}</p>
                            <button onClick={() => handleEnroll(course._id)}>
                                Enroll Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
