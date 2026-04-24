import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import '../App.css';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const res = await login(formData.email, formData.password);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle" style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '32px', fontSize: '15px' }}>
                    Continue your learning journey with EduHub
                </p>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one for free</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
