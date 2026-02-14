import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            authLogin(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <>
            <div className="auth-container animate-fade-in">
                <div className="glass-card auth-card">
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
                    <p style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                        Sign in to access your account
                    </p>

                    {error && (
                        <div style={{ backgroundColor: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="name@school.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'hsl(var(--primary))' }}>Forgot password?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Sign In
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'hsl(var(--text-secondary))' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'hsl(var(--primary))', fontWeight: '600' }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
