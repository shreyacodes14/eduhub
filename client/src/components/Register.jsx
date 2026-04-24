import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
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
            const response = await register(formData.name, formData.email, formData.password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}
