import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.data.user);
            } catch (err) {
                setError('Failed to load user data');
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1>Learning Platform</h1>
                <div>
                    <span>Welcome, {user?.name}</span>
                    <button onClick={() => navigate('/courses')} className="btn-primary">
                        Browse Courses
                    </button>
                    <button onClick={handleLogout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <h2>My Enrolled Courses</h2>
                {user?.enrolledCourses?.length === 0 ? (
                    <p>You haven't enrolled in any courses yet. <a href="/courses">Browse courses</a></p>
                ) : (
                    <div className="courses-grid">
                        {user?.enrolledCourses?.map(course => (
                            <div key={course._id} className="course-card">
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <p><strong>Category:</strong> {course.category}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
