import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import { User, Lock, Mail, AlertCircle, BookOpen, Briefcase } from 'lucide-react';

const Signup = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        student_id: '',
        grade: '',
        department: '',
        designation: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const payload = { ...formData, role };
            await signup(payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        }
    };

    return (
        <>
            <div className="auth-container animate-fade-in" style={{ padding: '2rem 1rem' }}>
                <div className="glass-card auth-card" style={{ maxWidth: '600px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h2>
                    <p style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                        Join as a {role}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                        <button
                            type="button"
                            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setRole('student')}
                            style={{ width: '140px' }}
                        >
                            <BookOpen size={18} className="icon-margin" /> Student
                        </button>
                        <button
                            type="button"
                            className={`btn ${role === 'staff' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setRole('staff')}
                            style={{ width: '140px' }}
                        >
                            <Briefcase size={18} className="icon-margin" /> Staff
                        </button>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid-cols-2" style={{ gap: '1.5rem' }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
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

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {role === 'student' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Student ID</label>
                                    <input
                                        type="text"
                                        name="student_id"
                                        className="form-input"
                                        placeholder="S12345"
                                        value={formData.student_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Grade / Class</label>
                                    <input
                                        type="text"
                                        name="grade"
                                        className="form-input"
                                        placeholder="10-A"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {role === 'staff' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        className="form-input"
                                        placeholder="Science"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        className="form-input"
                                        placeholder="Senior Teacher"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                Create Account
                            </button>
                        </div>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'hsl(var(--text-secondary))' }}>
                        Already have an account? <Link to="/login" style={{ color: 'hsl(var(--primary))', fontWeight: '600' }}>Log in</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;
