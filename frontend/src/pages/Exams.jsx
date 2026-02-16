import React, { useState, useEffect } from 'react';
import { getExams } from '../api';
import { Calendar, Clock, MapPin, ArrowRight, Search, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await getExams();
            setExams(res.data);
        } catch (error) {
            console.error("Failed to fetch exams");
        } finally {
            setLoading(false);
        }
    };

    const filteredExams = exams.filter(exam =>
        exam.title.toLowerCase().includes(filter.toLowerCase()) ||
        exam.description?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="text-gradient">Upcoming Examinations</h1>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Browse and register for the latest academic assessments. Secure your spot today.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', gap: '2rem' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                    <input
                        type="text"
                        className="input"
                        style={{ paddingLeft: '3.5rem' }}
                        placeholder="Search by exam title or subject..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <button className="btn btn-outline" style={{ gap: '0.75rem' }}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid hsla(var(--primary)/.2)', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%' }} />
                </div>
            ) : (
                <div className="grid-cols-3">
                    {filteredExams.length > 0 ? filteredExams.map(exam => (
                        <div key={exam.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '0', right: '0', padding: '1rem' }}>
                                <div style={{ background: 'hsla(var(--success) / 0.1)', color: 'hsl(var(--success))', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '800' }}>
                                    OPEN
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{exam.title}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6', height: '4.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                                    {exam.description || 'Comprehensive assessment focused on key core academic principles and practical application.'}
                                </p>
                            </div>

                            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                                    <Calendar size={16} className="text-gradient" />
                                    <span>{exam.date}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                                    <MapPin size={16} className="text-gradient" />
                                    <span>{exam.venue}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: '700' }}>
                                    <Sparkles size={16} style={{ color: 'hsl(var(--warning))' }} />
                                    <span>Fee: ${exam.fee}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <Link to={`/exams/${exam.id}`} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                    View Schedule <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 3rem' }} className="glass-card">
                            <h3 className="text-muted">No examinations found.</h3>
                            <button onClick={() => setFilter('')} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Clear Search</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Exams;
