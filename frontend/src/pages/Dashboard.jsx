import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Book, User, Calendar, Plus, Upload, Search, CheckCircle, FileText } from 'lucide-react';
import { getExams, getStudentRegistrations, getMaterials, createExam, registerForExam, simulatePayment, uploadDocument, getAIAdvice, uploadMaterial } from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser: user, logout } = useAuth();
    // const [user, setUser] = useState(null); // Managed by AuthContext
    const [exams, setExams] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    // States for interactives
    const [showExamModal, setShowExamModal] = useState(false);
    const [newExam, setNewExam] = useState({ title: '', date: '', time: '', venue: '', fee: '', description: '' });
    const [uploadDoc, setUploadDoc] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiAdvice, setAiAdvice] = useState('');
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchData(user);
        }
    }, [user, navigate]);

    const fetchData = async (currentUser) => {
        setLoading(true);
        try {
            const examsRes = await getExams();
            setExams(examsRes.data);

            const materialsRes = await getMaterials();
            setMaterials(materialsRes.data);

            if (currentUser.is_student) {
                const regsRes = await getStudentRegistrations();
                setRegistrations(regsRes.data);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            await createExam(newExam);
            setShowExamModal(false);
            fetchData(user);
            alert("Exam created successfully!");
        } catch (error) {
            alert("Failed to create exam");
        }
    };

    const handleRegister = async (examId) => {
        try {
            const res = await registerForExam(examId);
            // Simulate Payment immediately for demo
            if (window.confirm("Proceed to Payment? Fee: $" + (exams.find(ex => ex.id === examId)?.fee || '0'))) {
                await simulatePayment(res.data.id);
                alert("Registration & Payment Successful! Check your email.");
                fetchData(user);
            }
        } catch (error) {
            alert(error.response?.data?.detail || "Registration failed");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', 'Eligibility Check');

        try {
            const res = await uploadDocument(formData);
            alert(res.data.ai_feedback);
        } catch (error) {
            alert("Upload failed");
        }
    };

    const handleUploadMaterial = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newMaterial.title);
        formData.append('description', newMaterial.description);
        if (newMaterial.file) formData.append('file', newMaterial.file);

        try {
            await uploadMaterial(formData);
            setShowMaterialModal(false);
            fetchData(user);
            alert("Material uploaded successfully!");
        } catch (error) {
            alert("Upload failed");
        }
    };

    const handleAskAI = async () => {
        if (!searchQuery) return;
        try {
            const res = await getAIAdvice(searchQuery);
            setAiAdvice(res.data.advice);
        } catch (error) {
            alert("AI unavailable");
        }
    };

    if (!user) return null;

    return (
        <>
            <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem' }}>
                        Welcome, {user.username || user.email}
                        <span style={{ fontSize: '1rem', marginLeft: '1rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', backgroundColor: 'hsl(var(--primary))', color: 'white' }}>
                            {user.is_student ? 'Student' : 'Staff'}
                        </span>
                    </h1>
                    <button onClick={handleLogout} className="btn btn-outline">
                        <LogOut size={18} className="icon-margin" /> Logout
                    </button>
                </div>

                {/* --- STUDENT DASHBOARD --- */}
                {user.is_student && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                        {/* 1. Available Exams */}
                        <section>
                            <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid hsl(var(--primary))', display: 'inline-block' }}>Available Exams</h2>
                            <div className="grid-cols-2">
                                {exams.map(exam => {
                                    const isRegistered = registrations.some(r => r.exam === exam.id);
                                    return (
                                        <div key={exam.id} className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{exam.title}</h3>
                                            <p style={{ color: 'hsl(var(--text-secondary))' }}>Date: {exam.date} | Time: {exam.time}</p>
                                            <p style={{ color: 'hsl(var(--text-secondary))' }}>Venue: {exam.venue}</p>
                                            <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Fee: ${exam.fee}</p>
                                            <div style={{ marginTop: '1.5rem' }}>
                                                {isRegistered ? (
                                                    <span style={{ color: 'hsl(var(--success))', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <CheckCircle size={20} /> Registered & Paid
                                                    </span>
                                                ) : (
                                                    <button onClick={() => handleRegister(exam.id)} className="btn btn-primary" style={{ width: '100%' }}>
                                                        Register Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {exams.length === 0 && <p>No exams scheduled yet.</p>}
                            </div>
                        </section>

                        {/* 2. RAG / Study Materials */}
                        <section>
                            <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid hsl(var(--secondary))', display: 'inline-block' }}>Prepare with AI</h2>
                            <div className="glass-card">
                                <h3 style={{ marginBottom: '1rem' }}>Ask AI for Study Advice</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. How to prepare for Mathematics?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <button onClick={handleAskAI} className="btn btn-primary">Ask AI</button>
                                </div>
                                {aiAdvice && (
                                    <div style={{ padding: '1rem', backgroundColor: 'hsla(var(--primary)/0.05)', borderRadius: '0.5rem', borderLeft: '4px solid hsl(var(--primary))' }}>
                                        <strong>AI Suggestion:</strong>
                                        <p style={{ marginTop: '0.5rem' }}>{aiAdvice}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 3. Eligibility Check */}
                        <section>
                            <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid hsl(var(--accent))', display: 'inline-block' }}>Eligibility Check</h2>
                            <div className="glass-card">
                                <h3 style={{ marginBottom: '1rem' }}>Upload Documents for AI Verification</h3>
                                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Upload your certificates or transcripts. Our AI will check your eligibility.</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <label htmlFor="file-upload" className="btn btn-outline" style={{ cursor: 'pointer' }}>
                                        <Upload size={18} className="icon-margin" /> Choose File
                                    </label>
                                    <input id="file-upload" type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                                    <span>{uploadDoc ? uploadDoc.name : 'No file chosen'}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                )}


                {/* --- STAFF DASHBOARD --- */}
                {!user.is_student && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div className="grid-cols-2">
                            <div className="glass-card" onClick={() => setShowExamModal(true)} style={{ cursor: 'pointer', border: '2px dashed hsl(var(--primary))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                                <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', marginBottom: '1rem' }}>
                                    <Plus size={32} />
                                </div>
                                <h3>Create New Exam</h3>
                            </div>

                            <div className="glass-card">
                                <h3>Manage Materials</h3>
                                <p style={{ margin: '1rem 0', color: 'hsl(var(--text-secondary))' }}>Upload study guides and resources for students.</p>
                                <button className="btn btn-outline" onClick={() => setShowMaterialModal(true)}>Upload Material</button>
                            </div>
                        </div>

                        {/* Existing Exams List for Staff */}
                        <section>
                            <h2 style={{ marginBottom: '1rem' }}>Scheduled Exams</h2>
                            <div className="grid-cols-2">
                                {exams.map(exam => (
                                    <div key={exam.id} className="glass-card">
                                        <h4>{exam.title}</h4>
                                        <p>{exam.date} at {exam.time}</p>
                                        <p>{exam.venue}</p>
                                        <div style={{ marginTop: '1rem' }}>
                                            <button className="btn btn-sm btn-outline">View Registrations</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Create Exam Modal (Simple implementation) */}
            {showExamModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '500px', backgroundColor: 'var(--card-bg)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Schedule Exam</h2>
                        <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" placeholder="Exam Title" className="input" required value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="date" className="input" required value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                                <input type="time" className="input" required value={newExam.time} onChange={e => setNewExam({ ...newExam, time: e.target.value })} />
                            </div>
                            <input type="text" placeholder="Venue" className="input" required value={newExam.venue} onChange={e => setNewExam({ ...newExam, venue: e.target.value })} />
                            <input type="number" placeholder="Fee ($)" className="input" required value={newExam.fee} onChange={e => setNewExam({ ...newExam, fee: e.target.value })} />
                            <textarea placeholder="Description" className="input" rows="3" value={newExam.description} onChange={e => setNewExam({ ...newExam, description: e.target.value })}></textarea>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowExamModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Material Modal */}
            {showMaterialModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '500px', backgroundColor: 'var(--card-bg)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Upload Study Material</h2>
                        <form onSubmit={handleUploadMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" placeholder="Material Title" className="input" required value={newMaterial.title} onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })} />
                            <textarea placeholder="Description" className="input" rows="3" value={newMaterial.description} onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}></textarea>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label className="btn btn-outline" style={{ cursor: 'pointer', width: '100%' }}>
                                    <Upload size={18} className="icon-margin" /> Select File
                                    <input type="file" onChange={e => setNewMaterial({ ...newMaterial, file: e.target.files[0] })} style={{ display: 'none' }} />
                                </label>
                                <span>{newMaterial.file ? newMaterial.file.name : 'No file'}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowMaterialModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
