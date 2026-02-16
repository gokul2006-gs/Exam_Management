import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ChevronRight, GraduationCap } from 'lucide-react';

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
            setError(err.response?.data?.detail || 'Identity verification failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '3.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', padding: '1rem', borderRadius: '1.25rem', color: 'white', marginBottom: '1.5rem' }}>
                        <GraduationCap size={32} />
                    </div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Access Portal</h1>
                    <p className="text-muted">Enter your academic credentials.</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', border: '1px solid hsla(var(--error)/.2)' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input
                                type="email"
                                name="email"
                                className="input"
                                style={{ paddingLeft: '3.75rem' }}
                                placeholder="name@college.edu"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Security Key</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: '700' }}>Forgot key?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input
                                type="password"
                                name="password"
                                className="input"
                                style={{ paddingLeft: '3.75rem' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', marginTop: '1rem' }}>
                        Identify & Login <ChevronRight size={18} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem' }} className="text-muted">
                    New student? <Link to="/signup" style={{ color: 'hsl(var(--primary))', fontWeight: '800' }}>Create portal access</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
