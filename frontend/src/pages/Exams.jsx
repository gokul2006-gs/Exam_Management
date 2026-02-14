import React, { useState, useEffect } from 'react';
import { getExams } from '../api';
import { Calendar, Clock, MapPin, ArrowRight, Search } from 'lucide-react';
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
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Available Exams</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-secondary))' }} />
                    <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="Search exams..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading exams...</p>
            ) : (
                <div className="grid-cols-2">
                    {filteredExams.length > 0 ? filteredExams.map(exam => (
                        <div key={exam.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{exam.title}</h3>
                                <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.5', height: '3rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {exam.description || 'No description available for this exam.'}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--text-secondary))' }}>
                                    <Calendar size={16} /> {exam.date}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--text-secondary))' }}>
                                    <Clock size={16} /> {exam.time}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--text-secondary))' }}>
                                    <MapPin size={16} /> {exam.venue}
                                </div>
                                <div style={{ fontWeight: 'bold', color: 'hsl(var(--primary))' }}>
                                    Fee: ${exam.fee}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <Link to={`/exams/${exam.id}`} className="btn btn-outline" style={{ width: '100%' }}>
                                    View Details <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem', color: 'hsl(var(--text-secondary))' }}>
                            No exams found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Exams;
