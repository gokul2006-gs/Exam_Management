import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-nav">
            <Link to="/" className="nav-brand">ExamPortal</Link>
            <div className="nav-actions">
                {isAuthenticated ? (
                    <>
                        {/* Main Navigation for Authenticated Users */}
                        <Link to="/dashboard" className="btn btn-outline text-sm">
                            <LayoutDashboard size={16} className="icon-margin" /> Dashboard
                        </Link>
                        <Link to="/exams" className="btn btn-outline text-sm">
                            Exams
                        </Link>
                        <Link to="/study-materials" className="btn btn-outline text-sm">
                            Study
                        </Link>
                        {/* Simple Profile Link */}
                        <Link to="/profile" className="btn btn-outline text-sm" style={{ padding: '0.5rem' }}>
                            <User size={18} />
                        </Link>

                        <button onClick={handleLogout} className="btn btn-primary text-sm">
                            <LogOut size={16} className="icon-margin" /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline text-sm">
                            <LogIn size={16} className="icon-margin" /> Login
                        </Link>
                        <Link to="/signup" className="btn btn-primary text-sm">
                            <UserPlus size={16} className="icon-margin" /> Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
