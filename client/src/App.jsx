import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if current page is the Dashboard
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Conditionally hide the main navbar on Dashboard page */}
      {!isDashboard && (
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">Edu<span>Hub</span></Link>
            <div className="nav-links">
              <Link to="/">Home</Link>
              {user ? (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <span className="user-welcome">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register" className="btn-nav">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className={isDashboard ? "dashboard-layout" : "content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;