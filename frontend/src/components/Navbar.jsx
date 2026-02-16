import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, LayoutDashboard, User, GraduationCap, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-nav">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0' }}>
                <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', padding: '0.4rem', borderRadius: '0.75rem', color: 'white' }}>
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: '800' }}>EduExam</span>
                </Link>

                <div className="nav-actions">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-outline'} btn-sm`}
                            >
                                <LayoutDashboard size={16} /> Dash
                            </Link>

                            <Link
                                to="/exams"
                                className={`btn ${isActive('/exams') ? 'btn-primary' : 'btn-outline'} btn-sm`}
                            >
                                <Clock size={16} /> Exams
                            </Link>

                            <Link
                                to="/study-materials"
                                className={`btn ${isActive('/study-materials') ? 'btn-primary' : 'btn-outline'} btn-sm`}
                            >
                                <BookOpen size={16} /> Study
                            </Link>

                            <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--glass-border)', margin: '0 0.5rem' }} />

                            <Link
                                to="/profile"
                                className={`btn ${isActive('/profile') ? 'btn-primary' : 'btn-outline'} btn-sm`}
                                style={{ borderRadius: '50%', width: '38px', height: '38px', padding: '0' }}
                            >
                                <User size={18} />
                            </Link>

                            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ border: 'none', color: 'hsl(var(--error))' }}>
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">
                                <LogIn size={16} /> Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                <UserPlus size={16} /> Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
