import React, { useState, useEffect } from 'react';
import { getMaterials, getAIAdvice } from '../api';
import { Search, FileText, Download, Sparkles } from 'lucide-react';

const StudyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiQuery, setAiQuery] = useState('');
    const [aiAdvice, setAiAdvice] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await getMaterials();
            setMaterials(res.data);
        } catch (error) {
            console.error("Failed to fetch materials");
        } finally {
            setLoading(false);
        }
    };

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!aiQuery.trim()) return;

        setAiLoading(true);
        try {
            const res = await getAIAdvice(aiQuery);
            setAiAdvice(res.data.advice);
        } catch (error) {
            setAiAdvice("Sorry, I couldn't generate advice at this moment. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Study Center</h1>

            <div className="grid-cols-2" style={{ alignItems: 'start' }}>
                <section>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles size={24} color="hsl(var(--secondary))" /> AI Study Assistant
                    </h2>
                    <div className="glass-card">
                        <form onSubmit={handleAskAI} style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">What do you need help with?</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Tips for Calculus final..."
                                    value={aiQuery}
                                    onChange={(e) => setAiQuery(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary" disabled={aiLoading}>
                                    {aiLoading ? 'Thinking...' : 'Ask AI'}
                                </button>
                            </div>
                        </form>

                        {aiAdvice && (
                            <div style={{ padding: '1.5rem', borderRadius: '0.5rem', backgroundColor: 'hsla(var(--primary)/0.05)', borderLeft: '4px solid hsl(var(--secondary))', lineHeight: '1.6' }}>
                                <h4 style={{ marginBottom: '0.5rem', color: 'hsl(var(--secondary))' }}>AI Suggestion:</h4>
                                <p style={{ whiteSpace: 'pre-line' }}>{aiAdvice}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={24} color="hsl(var(--primary))" /> Resources & Guides
                    </h2>

                    {loading ? <p>Loading resources...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {materials.length > 0 ? materials.map(mat => (
                                <div key={mat.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{mat.title}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>{mat.description}</p>
                                    </div>
                                    <a href={mat.file || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                        <Download size={16} />
                                    </a>
                                </div>
                            )) : (
                                <p style={{ color: 'hsl(var(--text-secondary))', fontStyle: 'italic' }}>No study materials available at the moment.</p>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StudyMaterials;
