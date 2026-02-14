import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { resetPassword } from '../api';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [new_password, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if email and otp are present
    const email = location.state?.email;
    const otp = location.state?.otp;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new_password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        try {
            await resetPassword({ email, otp, new_password });
            setSuccess('Password updated successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update password');
        }
    };

    if (!email || !otp) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Invalid Request.</h2>
                <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
            </div>
        );
    }

    return (
        <>
            <div className="auth-container animate-fade-in">
                <div className="glass-card auth-card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Set New Password</h2>

                    {error && <div style={{ color: 'hsl(var(--error))', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                    {success && <div style={{ color: 'hsl(var(--success))', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="password"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="••••••••"
                                    value={new_password}
                                    onChange={(e) => setNewPassword(e.target.value)}
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
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="••••••••"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
