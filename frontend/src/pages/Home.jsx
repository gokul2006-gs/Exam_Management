import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Zap, Users, GraduationCap } from 'lucide-react';

const Home = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{ padding: '8rem 1.5rem 6rem', textAlign: 'center', position: 'relative' }}>
                <div className="container">
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        background: 'hsla(var(--primary) / 0.1)',
                        color: 'hsl(var(--primary))',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginBottom: '2rem'
                    }}>
                        <GraduationCap size={18} />
                        <span>Academic Excellence Portal</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', maxWidth: '900px', margin: '0 auto 2rem' }}>
                        Manage Your <span className="text-gradient">Academic Future</span> with Precision
                    </h1>

                    <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        The most advanced college exam registration system. Secure, efficient, and powered by AI to ensure a seamless academic journey.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '1.2rem 3rem' }}>
                            Start Registration <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-outline" style={{ padding: '1.2rem 3rem' }}>
                            Student Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '6rem 1.5rem' }}>
                <div className="container">
                    <div className="grid-cols-3">
                        <div className="glass-card">
                            <div style={{ color: 'hsl(var(--primary))', marginBottom: '1.5rem' }}>
                                <Zap size={40} />
                            </div>
                            <h3>Instant Processing</h3>
                            <p className="text-muted">Register for multiple exams in seconds with our high-performance cloud infrastructure.</p>
                        </div>
                        <div className="glass-card">
                            <div style={{ color: 'hsl(var(--secondary))', marginBottom: '1.5rem' }}>
                                <ShieldCheck size={40} />
                            </div>
                            <h3>AI Verification</h3>
                            <p className="text-muted">Upload your documents and let our AI instantly verify your eligibility and prerequisites.</p>
                        </div>
                        <div className="glass-card">
                            <div style={{ color: 'hsl(var(--accent))', marginBottom: '1.5rem' }}>
                                <BookOpen size={40} />
                            </div>
                            <h3>Study Resources</h3>
                            <p className="text-muted">Access curated study materials and AI-driven prep advice tailored to your selected exams.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portal Selection Section */}
            <section style={{ padding: '6rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <div className="grid-cols-2">
                        <div className="glass-card" style={{ borderLeft: '4px solid hsl(var(--primary))' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <Users size={32} />
                                <h2>For Students</h2>
                            </div>
                            <p className="text-muted" style={{ marginBottom: '2rem' }}>
                                Access your personal dashboard to register for exams, download hall tickets, and track your academic progress in real-time.
                            </p>
                            <Link to="/signup" className="btn btn-outline" style={{ width: '100%' }}>
                                Access Student Portal
                            </Link>
                        </div>
                        <div className="glass-card" style={{ borderLeft: '4px solid hsl(var(--secondary))' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <GraduationCap size={32} />
                                <h2>For Staff</h2>
                            </div>
                            <p className="text-muted" style={{ marginBottom: '2rem' }}>
                                Administrative tools to create exam schedules, manage student registrations, and oversee the entire academic session.
                            </p>
                            <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>
                                Administrative Access
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div className="container">
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                        © 2026 Academic Excellence Portal. Built for the future of education.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
