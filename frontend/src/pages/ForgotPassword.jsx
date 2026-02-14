import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword } from '../api';
import { Mail, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setMessage('OTP sent to your email.');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 1000);
        } catch (err) {
            setError('Failed to send OTP. User may not exist.');
        }
    };

    return (
        <>
            <div className="auth-container animate-fade-in">
                <div className="glass-card auth-card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h2>
                    <p style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                        Enter your email to receive an OTP
                    </p>

                    {message && <div style={{ color: 'hsl(var(--success))', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                    {error && <div style={{ color: 'hsl(var(--error))', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="email"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Send OTP <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to="/login" className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>Back to Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
