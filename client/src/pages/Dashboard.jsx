import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, createCourse, enrollCourse, unenrollCourse, getCurrentUser, default as API } from '../api';
import '../Dashboard.css';

// Recommended course data (static — development focused)
const RECOMMENDED = [
    { id: 'r1', emoji: '⚛️', bg: '#dbeafe', title: 'React.js & Vite', sub: 'Frontend Development', stars: 5, price: '₹1,499' },
    { id: 'r2', emoji: '🟢', bg: '#dcfce7', title: 'Node.js & Express', sub: 'Backend Development', stars: 5, price: '₹1,299' },
    { id: 'r3', emoji: '🐍', bg: '#fef9c3', title: 'Python with Django', sub: 'Web Development', stars: 4, price: '₹1,799' },
    { id: 'r4', emoji: '🐳', bg: '#ede9fe', title: 'DevOps & Docker', sub: 'Cloud & Deployment', stars: 5, price: '₹2,499' },
    { id: 'r5', emoji: '🔷', bg: '#e0f2fe', title: 'TypeScript Mastery', sub: 'JavaScript Development', stars: 4, price: '₹1,199' },
    { id: 'r6', emoji: '🍃', bg: '#d1fae5', title: 'MongoDB & Design', sub: 'Database Engineering', stars: 4, price: '₹899' },
    { id: 'r7', emoji: '🚀', bg: '#ffedd5', title: 'Next.js 14', sub: 'Full Stack Development', stars: 5, price: '₹1,999' },
    { id: 'r8', emoji: '🐙', bg: '#f1f5f9', title: 'Git & GitHub', sub: 'Version Control', stars: 5, price: '₹499' },
    { id: 'r9', emoji: '🎨', bg: '#fce7f3', title: 'UI/UX Design', sub: 'Product Design', stars: 4, price: '₹1,599' },
];

function Stars({ count }) {
    return (
        <div className="stars">
            {'★'.repeat(count)}{'☆'.repeat(5 - count)}
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }) {
    return (
        <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
            <i className={`fa ${icon}`}></i>
            <span>{label}</span>
        </div>
    );
}

export default function Dashboard() {
    const [courses, setCourses]       = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [enrollMsg, setEnrollMsg]   = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode]     = useState(false);
    const [formData, setFormData]     = useState({ title: '', description: '', price: '' });
    const navigate = useNavigate();

    const user        = JSON.parse(localStorage.getItem('user'));
    const isInstructor = user?.role === 'instructor';
    const [activeTab, setActiveTab] = useState(isInstructor ? 'dashboard' : 'dashboard');

    useEffect(() => { 
        fetchCourses(); 
        fetchUserData();
    }, []);

    // Apply dark class to body root
    useEffect(() => {
        const root = document.getElementById('root');
        if (root) root.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const fetchCourses = async () => {
        try {
            const res = await getAllCourses();
            setCourses(res.data);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await getCurrentUser();
            if (res.data && res.data.enrolledCourses) {
                setEnrolledIds(res.data.enrolledCourses);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await createCourse({ ...formData, instructor: user?.id });
            alert('Course published!');
            setFormData({ title: '', description: '', price: '' });
            setActiveTab('courses');
            fetchCourses();
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to add course.');
        }
    };

    const handleEnroll = async (courseId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Login to enrol");
            navigate('/login');
            return;
        }

        try {
            const res = await enrollCourse(courseId);
            if (res.data && res.data.enrolledCourses) {
                setEnrolledIds(res.data.enrolledCourses);
            } else {
                setEnrolledIds(prev => [...prev, courseId]);
            }
            setEnrollMsg(prev => ({ ...prev, [courseId]: 'success' }));
        } catch (err) {
            const msg = err?.response?.data?.message || 'Enrollment failed.';
            setEnrollMsg(prev => ({ ...prev, [courseId]: msg }));
        }
    };

    const handleUnenroll = async (courseId) => {
        if (!window.confirm('Are you sure you want to unenroll?')) return;
        try {
            const res = await unenrollCourse(courseId);
            if (res.data && res.data.enrolledCourses) {
                setEnrolledIds(res.data.enrolledCourses);
            } else {
                setEnrolledIds(prev => prev.filter(id => id.toString() !== courseId.toString()));
            }
            setEnrollMsg(prev => {
                const newMsgs = { ...prev };
                delete newMsgs[courseId];
                return newMsgs;
            });
        } catch (err) {
            alert('Failed to unenroll');
        }
    };

    console.log('Current Enrolled IDs:', enrolledIds);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    /* ─── SIDEBAR LINKS ─── */
    const studentLinks = [
        { icon: 'fa-th-large',       label: 'Overview',        tab: 'dashboard' },
        { icon: 'fa-graduation-cap', label: 'Browse Courses',  tab: 'browse'    },
        { icon: 'fa-check-circle',   label: 'My Enrollments',  tab: 'enrolled'  },
    ];

    const instructorLinks = [
        { icon: 'fa-th-large',     label: 'Overview',     tab: 'dashboard' },
        { icon: 'fa-book',         label: 'All Courses',  tab: 'courses'   },
        { icon: 'fa-plus-circle',  label: 'Add Course',   tab: 'add'       },
    ];

    const links = isInstructor ? instructorLinks : studentLinks;

    const tabTitle = {
        dashboard: 'Overview',
        browse:    'Browse Courses',
        enrolled:  'My Enrollments',
        courses:   'All Courses',
        add:       'Add New Course',
    }[activeTab];

    return (
        <div className={`dashboard-layout ${darkMode ? 'dark' : ''}`}>

            {/* ── SIDEBAR ── */}
            <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">Edu<span>Hub</span></div>
                <div className="sidebar-nav">
                    {links.map(l => (
                        <SidebarItem key={l.tab} icon={l.icon} label={l.label}
                            active={activeTab === l.tab} onClick={() => { setActiveTab(l.tab); setIsMenuOpen(false); }} />
                    ))}
                    <div className="sidebar-logout" onClick={handleLogout}>
                        <i className="fa fa-sign-out-alt"></i> Logout
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="main-content">

                {/* Header */}
                <div className="content-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <i className="fa fa-bars"></i>
                        </button>
                        <h4>{tabTitle}</h4>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="dark-toggle-wrap">
                        <span>Dark Mode</span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(d => !d)} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'dashboard' && (
                    <>
                        {/* Welcome */}
                        <div className="welcome-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h5>Welcome, {user?.name}! 👋</h5>
                                    <p>You are logged in as a <strong>{user?.role}</strong>. Use the sidebar to navigate.</p>
                                </div>
                                <button 
                                    onClick={async () => {
                                        if (window.confirm('Clear all your enrollments?')) {
                                            try {
                                                await API.post('/auth/clear-enrollments');
                                                setEnrolledIds([]);
                                                setEnrollMsg({}); // Clear stale enrollment messages
                                                alert('Data reset successfully!');
                                            } catch (e) { alert('Reset failed'); }
                                        }
                                    }}
                                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                >
                                    Reset My Data
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-card-info">
                                    <p>Total Courses</p>
                                    <h3>{courses.length}</h3>
                                </div>
                                <div className="stat-icon blue"><i className="fa fa-book"></i></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-info">
                                    <p>My Enrollments</p>
                                    <h3>{enrolledIds.length}</h3>
                                </div>
                                <div className="stat-icon green"><i className="fa fa-graduation-cap"></i></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-info">
                                    <p>Recommended</p>
                                    <h3>{RECOMMENDED.length}</h3>
                                </div>
                                <div className="stat-icon purple"><i className="fa fa-star"></i></div>
                            </div>
                        </div>

                        {/* Recommended for You */}
                        <p className="section-title">Recommended for You</p>
                        <div className="recommended-grid">
                            {RECOMMENDED.map(r => {
                                // Try to find matching real course from DB by title
                                const realCourse = courses.find(c => c.title.toLowerCase().includes(r.title.toLowerCase().split(' ')[0]));
                                const courseId = realCourse?._id;
                                const isDone = courseId && enrolledIds.some(id => id.toString() === courseId.toString());
                                const msg = courseId ? enrollMsg[courseId] : null;

                                return (
                                    <div className="rec-card" key={r.id}>
                                        <div className="rec-card-banner" style={{ background: r.bg }}>
                                            <span style={{ fontSize: 42 }}>{r.emoji}</span>
                                        </div>
                                        <div className="rec-card-body">
                                            <h6>{r.title}</h6>
                                            <p>{r.sub}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Stars count={r.stars} />
                                                    <p className="rec-price" style={{ marginTop: 4 }}>{r.price}</p>
                                                </div>
                                                
                                                {courseId && (
                                                    msg === 'success' || isDone ? (
                                                        <button 
                                                            onClick={() => handleUnenroll(courseId)}
                                                            style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                                                        >
                                                            Unenroll
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleEnroll(courseId)}
                                                            style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                                                        >
                                                            Enroll
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ── BROWSE COURSES ── */}
                {activeTab === 'browse' && (
                    <div className="admin-card table-wrapper">
                        {courses.length === 0 ? (
                            <div className="empty-state">
                                <i className="fa fa-book-open"></i>
                                <p>No courses available yet.</p>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => {
                                        // Robust string comparison
                                        const done = enrolledIds.some(id => id.toString() === course._id.toString());
                                        const msg  = enrollMsg[course._id];
                                        return (
                                            <tr key={course._id}>
                                                <td className="course-title-cell">{course.title}</td>
                                                <td className="course-desc-cell">{course.description?.substring(0, 70)}...</td>
                                                <td><strong>₹{course.price || 'Free'}</strong></td>
                                                <td>
                                                    {msg === 'success' || done ? (
                                                        <button 
                                                            className="btn-enroll" 
                                                            style={{ background: '#fee2e2', color: '#ef4444' }}
                                                            onClick={() => handleUnenroll(course._id)}
                                                        >
                                                            Unenroll
                                                        </button>
                                                    ) : msg ? (
                                                        <span style={{ color: 'var(--danger)', fontSize: 12 }}>⚠️ {msg}</span>
                                                    ) : (
                                                        <button className="btn-enroll" onClick={() => handleEnroll(course._id)}>
                                                            Enroll Now
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ── MY ENROLLMENTS ── */}
                {activeTab === 'enrolled' && (
                    <div className="admin-card table-wrapper">
                        {enrolledIds.length === 0 ? (
                            <div className="empty-state">
                                <i className="fa fa-graduation-cap"></i>
                                <p>You haven't enrolled in any courses yet.<br />Go to <strong>Browse Courses</strong> to get started!</p>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr><th>Course Name</th><th>Description</th><th>Price</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {courses.filter(c => enrolledIds.some(id => id.toString() === c._id.toString())).map(course => (
                                        <tr key={course._id}>
                                            <td className="course-title-cell">{course.title}</td>
                                            <td className="course-desc-cell">{course.description?.substring(0, 70)}...</td>
                                            <td><strong>₹{course.price || 'Free'}</strong></td>
                                            <td>
                                                <button 
                                                    className="btn-enroll" 
                                                    style={{ background: '#fee2e2', color: '#ef4444' }}
                                                    onClick={() => handleUnenroll(course._id)}
                                                >
                                                    Unenroll
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ── INSTRUCTOR: ALL COURSES ── */}
                {activeTab === 'courses' && (
                    <div className="admin-card table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Course Name</th><th>Description</th><th>Price</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id}>
                                        <td className="course-title-cell">{course.title}</td>
                                        <td className="course-desc-cell">{course.description?.substring(0, 70)}...</td>
                                        <td><strong>₹{course.price}</strong></td>
                                        <td><span className="status-badge">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── INSTRUCTOR: ADD COURSE ── */}
                {activeTab === 'add' && (
                    <div className="admin-card form-container">
                        <form onSubmit={handleAddCourse}>
                            <div className="form-group">
                                <label>Course Title</label>
                                <input type="text" className="form-control"
                                    placeholder="e.g. Full Stack Web Development"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" rows="4"
                                    placeholder="Briefly describe the course..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input type="number" className="form-control" placeholder="999"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn-submit">🚀 Publish Course</button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}