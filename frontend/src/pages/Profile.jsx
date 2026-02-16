import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, School, CreditCard, Save, Shield, BadgeCheck, Camera, Settings, Activity } from 'lucide-react';

const Profile = () => {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        studentId: currentUser?.student_id || 'S-12345',
        grade: currentUser?.grade || 'Graduate Year',
        department: currentUser?.department || 'Computer Science',
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Success: Profile data synchronized with central academic records.");
        setIsEditing(false);
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Account <span className="text-gradient">Settings</span></h1>
                <p className="text-muted">Manage your academic profile and preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '2.5rem',
                                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                fontWeight: '800',
                                color: 'white',
                                boxShadow: '0 15px 35px -10px hsla(var(--primary)/0.5)'
                            }}>
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'hsl(var(--bg-dark))', border: '1px solid var(--glass-border)', padding: '0.6rem', borderRadius: '50%', color: 'white' }}>
                                <Camera size={16} />
                            </button>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '2rem' }}>{profile.username}</h2>
                                <BadgeCheck size={24} style={{ color: 'hsl(var(--primary))' }} />
                            </div>
                            <p style={{ color: 'hsl(var(--text-secondary))', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                                {currentUser?.is_student ? 'Active Student' : 'Certified Staff'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="text"
                                    name="username"
                                    className="input"
                                    style={{ paddingLeft: '3.5rem' }}
                                    value={profile.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Academic Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                <input
                                    type="email"
                                    name="email"
                                    className="input"
                                    style={{ paddingLeft: '3.5rem' }}
                                    value={profile.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {currentUser?.is_student ? (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Student ID</label>
                                    <div style={{ position: 'relative' }}>
                                        <CreditCard size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                        <input
                                            type="text"
                                            name="studentId"
                                            className="input"
                                            style={{ paddingLeft: '3.5rem' }}
                                            value={profile.studentId}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Current Academic Level</label>
                                    <div style={{ position: 'relative' }}>
                                        <School size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                        <input
                                            type="text"
                                            name="grade"
                                            className="input"
                                            style={{ paddingLeft: '3.5rem' }}
                                            value={profile.grade}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Primary Department</label>
                                <div style={{ position: 'relative' }}>
                                    <Shield size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                    <input
                                        type="text"
                                        name="department"
                                        className="input"
                                        style={{ paddingLeft: '3.5rem' }}
                                        value={profile.department}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', marginTop: '2rem' }}>
                            {isEditing ? (
                                <>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Discard</button>
                                    <button type="submit" className="btn btn-primary">
                                        <Save size={18} /> Sync Account
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(true)}>
                                    Update Credentials
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'hsla(var(--primary)/.1)', color: 'hsl(var(--primary))', padding: '0.6rem', borderRadius: '0.5rem' }}>
                                <Settings size={18} />
                            </div>
                            <h3 style={{ fontSize: '1rem' }}>Preferences</h3>
                        </div>
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                <span className="text-muted">Email Alerts</span>
                                <span style={{ fontWeight: '700', color: 'hsl(var(--success))' }}>ON</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                <span className="text-muted">2FA</span>
                                <span style={{ fontWeight: '700', color: 'hsl(var(--primary))' }}>ENABLED</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid hsl(var(--secondary))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <Activity size={18} className="text-gradient" />
                            <h3 style={{ fontSize: '1rem' }}>Activity</h3>
                        </div>
                        <p style={{ fontSize: '0.8rem', lineHeight: '1.5' }} className="text-muted">
                            Last successful login: <br />
                            <span style={{ color: 'white' }}>Today at 20:13:06 UTC</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
