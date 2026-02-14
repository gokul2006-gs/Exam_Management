import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <>
            <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        School Exam Registration
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'hsl(var(--text-secondary))', marginBottom: '3rem', lineHeight: '1.6' }}>
                        Welcome to the official exam registration portal. Students and staff can manage exam schedules, registrations, and results seamlessly.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Get Started
                        </Link>
                        <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Login Now
                        </Link>
                    </div>
                </div>

                <div className="grid-cols-2" style={{ marginTop: '6rem' }}>
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Students</h3>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                            Register for upcoming exams, check your schedules, and view your results instantly.
                        </p>
                        <Link to="/signup" className="btn btn-outline">Student Portal &rarr;</Link>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Staff</h3>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                            Manage exam events, oversee registrations, and publish results efficiently.
                        </p>
                        <Link to="/signup" className="btn btn-outline">Staff Access &rarr;</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
