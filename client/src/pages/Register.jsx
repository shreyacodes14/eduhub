import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import '../App.css';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            // Show the actual error message returned by the server
            const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                <h2>Join EduHub</h2>
                <p className="auth-subtitle" style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '32px', fontSize: '15px' }}>
                    Start your journey with the world's best educators
                </p>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder=" "
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder=" "
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary-auth" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Free Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In instead</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;