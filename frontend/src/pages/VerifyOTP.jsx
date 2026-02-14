import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { verifyOtp } from '../api';
import { Key } from 'lucide-react';

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOtp({ email, otp });
            // API returns { detail: 'OTP verified' } or success
            navigate('/reset-password', { state: { email, otp } });
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid OTP');
        }
    };

    if (!email) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>No email provided.</h2>
                <button onClick={() => navigate('/forgot-password')} className="btn btn-primary">Go Back</button>
            </div>
        );
    }

    return (
        <>
            <div className="auth-container animate-fade-in">
                <div className="glass-card auth-card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Verify OTP</h2>
                    <p style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                        Enter the code sent to {email}
                    </p>

                    {error && <div style={{ color: 'hsl(var(--error))', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">One-Time Password</label>
                            <div style={{ position: 'relative' }}>
                                <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem', letterSpacing: '0.2rem', fontSize: '1.2rem', textAlign: 'center' }}
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Verify Code
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default VerifyOTP;
