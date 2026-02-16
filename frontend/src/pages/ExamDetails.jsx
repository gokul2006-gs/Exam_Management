import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExams, registerForExam, simulatePayment } from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, ArrowLeft, ShieldCheck, Info } from 'lucide-react';

const ExamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExamDetails();
    }, [id]);

    const fetchExamDetails = async () => {
        try {
            const res = await getExams();
            const foundExam = res.data.find(e => e.id.toString() === id);
            if (foundExam) {
                setExam(foundExam);
            } else {
                setError("Exam not found.");
            }
        } catch (err) {
            setError("Failed to load exam details.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            const res = await registerForExam(exam.id);
            if (window.confirm(`Register for ${exam.title}? Fee: $${exam.fee}`)) {
                await simulatePayment(res.data.id);
                alert("Successful! You are now registered.");
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.detail || "Registration failed.");
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid hsla(var(--primary)/.2)', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%' }} />
        </div>
    );

    if (error) return (
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ color: 'hsl(var(--error))', marginBottom: '1rem' }}>Oops!</h2>
                <p className="text-muted">{error}</p>
                <button onClick={() => navigate('/exams')} className="btn btn-outline" style={{ marginTop: '2rem' }}>Back to Exams</button>
            </div>
        </div>
    );

    if (!exam) return null;

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline btn-sm"
                style={{ marginBottom: '2.5rem', border: 'none' }}
            >
                <ArrowLeft size={18} /> Back to Listings
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <div style={{ background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={16} /> Accredited Examination
                    </div>

                    <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }} className="text-gradient">
                        {exam.title}
                    </h1>

                    <div style={{ height: '2px', background: 'var(--glass-border)', margin: '2rem 0' }} />

                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Info size={20} className="text-muted" /> Description
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.7', marginBottom: '3rem' }}>
                        {exam.description || 'No detailed description available. This examination covers core academic competencies as scheduled by the department.'}
                    </p>

                    <div className="grid-cols-2" style={{ gap: '2rem' }}>
                        {[
                            { icon: Calendar, label: 'Date', value: exam.date, color: 'var(--primary)' },
                            { icon: Clock, label: 'Time', value: exam.time, color: 'var(--secondary)' },
                            { icon: MapPin, label: 'Venue', value: exam.venue, color: 'var(--accent)' },
                            { icon: DollarSign, label: 'Course Fee', value: `$${exam.fee}`, color: 'var(--success)' },
                        ].map((item, idx) => (
                            <div key={idx} style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                                <div style={{ color: `hsl(${item.color})`, marginBottom: '0.75rem' }}>
                                    <item.icon size={22} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ position: 'sticky', top: '100px' }}>
                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/.05), hsla(var(--secondary)/.02))' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Enroll Now</h2>

                        <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span className="text-muted">Total Fee</span>
                                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'hsl(var(--success))' }}>${exam.fee}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem' }} className="text-muted">Incl. digital materials and verification</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                'Full eligibility access',
                                'AI-driven study plan',
                                'Digital hall ticket',
                                'Immediate results access'
                            ].map((text, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                                    <CheckCircle size={16} style={{ color: 'hsl(var(--success))' }} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>

                        {currentUser ? (
                            <button onClick={handleRegister} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }}>
                                Proceed to Registration
                            </button>
                        ) : (
                            <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ width: '100%', padding: '1.2rem' }}>
                                Login to Register
                            </button>
                        )}

                        <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1.5rem' }} className="text-muted">
                            By registering, you agree to our examination policies and academic integrity code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetails;
