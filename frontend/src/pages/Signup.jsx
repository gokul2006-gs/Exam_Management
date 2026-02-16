import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import { User, Lock, Mail, AlertCircle, BookOpen, Briefcase, ChevronRight } from 'lucide-react';

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
        <div className="auth-container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }} className="text-gradient">Join the Portal</h1>
                    <p className="text-muted">Create your academic identity to get started.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                    <button
                        type="button"
                        className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRole('student')}
                    >
                        <BookOpen size={18} /> Student
                    </button>
                    <button
                        type="button"
                        className={`btn ${role === 'staff' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRole('staff')}
                    >
                        <Briefcase size={18} /> Staff
                    </button>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', border: '1px solid hsla(var(--error)/.2)' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Academic Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input className="input" type="email" name="email" style={{ paddingLeft: '3.5rem' }} placeholder="your@college.edu" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Preferred Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input className="input" type="text" name="username" style={{ paddingLeft: '3.5rem' }} placeholder="Global-ID" value={formData.username} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Security Key</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input className="input" type="password" name="password" style={{ paddingLeft: '3.5rem' }} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Verify Key</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input className="input" type="password" name="confirmPassword" style={{ paddingLeft: '3.5rem' }} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    {role === 'student' ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">Unique Student ID</label>
                                <input className="input" type="text" name="student_id" placeholder="Ex: S-2023001" value={formData.student_id} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Academic Level</label>
                                <input className="input" type="text" name="grade" placeholder="Ex: Sophmore" value={formData.grade} onChange={handleChange} required />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <input className="input" type="text" name="department" placeholder="Ex: Engineering" value={formData.department} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Official Designation</label>
                                <input className="input" type="text" name="designation" placeholder="Ex: Professor" value={formData.designation} onChange={handleChange} required />
                            </div>
                        </>
                    )}

                    <div style={{ gridColumn: 'span 2', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>
                            Register Account <ChevronRight size={18} />
                        </button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem' }} className="text-muted">
                    Already registered? <Link to="/login" style={{ color: 'hsl(var(--primary))', fontWeight: '800' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
