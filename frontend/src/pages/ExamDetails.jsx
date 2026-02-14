import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExams, registerForExam, simulatePayment } from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

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
            // Fetching all for now since we don't have a single GET endpoint. 
            // In a real app, use: const res = await getExam(id);
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
            if (window.confirm(`Confirm registration for ${exam.title}? Fee: $${exam.fee}`)) {
                await simulatePayment(res.data.id);
                alert("Registered successfully!");
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.detail || "Registration failed. You may already be registered.");
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
    if (error) return <div className="container" style={{ padding: '2rem', color: 'var(--error)' }}>{error}</div>;
    if (!exam) return null;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{exam.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
                        {exam.description || 'No detailed description provided for this examination.'}
                    </p>
                </div>

                <div className="grid-cols-2" style={{ gap: '3rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Exam Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'hsla(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Date</p>
                                    <p style={{ fontWeight: '600' }}>{exam.date}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'hsla(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Time</p>
                                    <p style={{ fontWeight: '600' }}>{exam.time}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'hsla(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Venue</p>
                                    <p style={{ fontWeight: '600' }}>{exam.venue}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'hsla(var(--success)/0.1)', color: 'hsl(var(--success))' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Registration Fee</p>
                                    <p style={{ fontWeight: '600', color: 'hsl(var(--success))', fontSize: '1.2rem' }}>${exam.fee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className="glass-card" style={{ backgroundColor: 'hsla(var(--primary)/0.05)', border: '1px solid hsla(var(--primary)/0.2)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Ready to Register?</h3>
                            <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="hsl(var(--success))" /> Verify your eligibility</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="hsl(var(--success))" /> Review exam schedule</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="hsl(var(--success))" /> Prepare payment method</li>
                            </ul>

                            {currentUser ? (
                                <button onClick={handleRegister} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                    Register Now
                                </button>
                            ) : (
                                <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ width: '100%', padding: '1rem' }}>
                                    Login to Register
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetails;
