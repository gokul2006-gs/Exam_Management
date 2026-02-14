import React, { useState, useEffect } from 'react';
import { getStudentRegistrations } from '../api';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await getStudentRegistrations();
            setRegistrations(res.data);
        } catch (error) {
            console.error("Failed to fetch registrations");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Registrations</h1>

            {loading ? (
                <p>Loading records...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {registrations.length > 0 ? registrations.map((reg) => (
                        <div key={reg.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'hsla(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>Exam Registration #{reg.id}</h3>
                                    <p style={{ color: 'hsl(var(--text-secondary))' }}>Exam ID: {reg.exam}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginTop: '0.5rem' }}>Registered on: {new Date(reg.registration_date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: 'hsl(var(--success))', fontWeight: 'bold' }}>
                                    <CheckCircle size={18} /> Confirmed
                                </div>
                                <Link to={`/exams/${reg.exam}`} className="btn btn-sm btn-outline">
                                    View Exam Info
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>You haven't registered for any exams yet.</p>
                            <Link to="/exams" className="btn btn-primary">Browse Available Exams</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
