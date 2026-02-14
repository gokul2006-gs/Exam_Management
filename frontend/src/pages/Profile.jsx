import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, School, CreditCard, Save } from 'lucide-react';

const Profile = () => {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    // Placeholder state for profile form - in a real app, populate from currentUser or fetch profile endpoint
    const [profile, setProfile] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        studentId: currentUser?.student_id || 'S-12345',
        grade: currentUser?.grade || '10th Grade',
        department: currentUser?.department || 'N/A',
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add API call to update profile here
        alert("Profile updated successfully (Simulation)");
        setIsEditing(false);
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h1>
            <div className="glass-card" style={{ maxWidth: '800px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem' }}>{profile.username}</h2>
                        <p style={{ color: 'hsl(var(--text-secondary))' }}>{currentUser?.is_student ? 'Student' : 'Staff Member'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid-cols-2">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input
                                type="text"
                                name="username"
                                className="form-input"
                                style={{ paddingLeft: '3rem' }}
                                value={profile.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                style={{ paddingLeft: '3rem' }}
                                value={profile.email}
                                onChange={handleChange}
                                disabled={!isEditing} // Typically email is immutable or requires verification
                            />
                        </div>
                    </div>

                    {currentUser?.is_student && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Student ID</label>
                                <div style={{ position: 'relative' }}>
                                    <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                    <input
                                        type="text"
                                        name="studentId"
                                        className="form-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={profile.studentId}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Grade / Class</label>
                                <div style={{ position: 'relative' }}>
                                    <School size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                                    <input
                                        type="text"
                                        name="grade"
                                        className="form-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={profile.grade}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {!currentUser?.is_student && (
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="form-input"
                                value={profile.department}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    )}

                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        {isEditing ? (
                            <>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} className="icon-margin" /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
