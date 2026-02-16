import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut, Book, User as UserIcon, Calendar, Plus, Upload,
    Search, CheckCircle, FileText, Download, Sparkles, AlertTriangle,
    ChevronRight, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';
import {
    getExams, getStudentRegistrations, getMaterials,
    createExam, registerForExam, simulatePayment,
    uploadDocument, getAIAdvice, uploadMaterial, getHallTicket
} from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser: user, logout } = useAuth();
    const [exams, setExams] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal/Interactive States
    const [showExamModal, setShowExamModal] = useState(false);
    const [newExam, setNewExam] = useState({ title: '', date: '', time: '', venue: '', fee: '', description: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [aiAdvice, setAiAdvice] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [examsRes, materialsRes] = await Promise.all([
                getExams(),
                getMaterials()
            ]);
            setExams(examsRes.data);
            setMaterials(materialsRes.data);

            if (user?.is_student) {
                const regsRes = await getStudentRegistrations();
                setRegistrations(regsRes.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDownloadHallTicket = async (regId) => {
        try {
            const res = await getHallTicket(regId);
            const ticket = res.data;
            // For demo, we just alert the JSON or open a stylized window
            const ticketWindow = window.open('', '_blank', 'width=800,height=600');
            ticketWindow.document.write(`
                <html>
                    <head>
                        <title>Hall Ticket - ${ticket.exam_title}</title>
                        <style>
                            body { font-family: 'Inter', sans-serif; padding: 40px; background: #f4f7f6; }
                            .ticket { background: white; border: 2px solid #333; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                            .title { font-size: 24px; font-weight: bold; color: #1a56db; }
                            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                            .label { color: #666; font-size: 12px; text-transform: uppercase; }
                            .value { font-weight: bold; font-size: 16px; margin-top: 4px; }
                            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                            .barcode { background: #000; height: 40px; margin: 20px 0; color: white; display: flex; align-items: center; justify-content: center; letter-spacing: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="ticket">
                            <div class="header">
                                <div class="title">ADMIT CARD / HALL TICKET</div>
                                <div style="margin-top: 5px; color: #666;">Annual Examinations 2026</div>
                            </div>
                            <div class="details">
                                <div>
                                    <div class="label">Student Name</div>
                                    <div class="value">${ticket.student_name}</div>
                                </div>
                                <div>
                                    <div class="label">Student ID</div>
                                    <div class="value">${ticket.student_id}</div>
                                </div>
                                <div style="grid-column: span 2;">
                                    <div class="label">Examination Title</div>
                                    <div class="value">${ticket.exam_title}</div>
                                </div>
                                <div>
                                    <div class="label">Date</div>
                                    <div class="value">${ticket.exam_date}</div>
                                </div>
                                <div>
                                    <div class="label">Time</div>
                                    <div class="value">${ticket.exam_time}</div>
                                </div>
                                <div style="grid-column: span 2;">
                                    <div class="label">Venue</div>
                                    <div class="value">${ticket.exam_venue}</div>
                                </div>
                            </div>
                            <div class="barcode">${ticket.barcode_placeholder}</div>
                            <div class="footer">
                                Issued on: ${ticket.issued_on}<br>
                                This is a computer-generated document. No signature required.
                            </div>
                            <button onclick="window.print()" style="margin-top: 20px; width: 100%; padding: 10px; background: #1a56db; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Hall Ticket</button>
                        </div>
                    </body>
                </html>
            `);
        } catch (error) {
            alert("Could not generate hall ticket. Ensure payment is complete.");
        }
    };

    if (loading && exams.length === 0) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid hsla(var(--primary)/.1)', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%' }} />
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
            {/* Header Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Hello, <span className="text-gradient">{user.username || user.email.split('@')[0]}</span>
                    </h1>
                    <p className="text-muted">Welcome back to your academic command center.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <ShieldCheck size={14} /> {user.is_student ? 'Student Access' : 'Staff Access'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
                <main style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                    {/* 1. Student Sections */}
                    {user.is_student && (
                        <>
                            {/* Registrations & Hall Tickets */}
                            <section>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem' }}>Your Registrations</h2>
                                    <Link to="/exams" className="btn btn-outline btn-sm">Browse More <ArrowRight size={14} /></Link>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {registrations.length > 0 ? registrations.map(reg => {
                                        const exam = exams.find(e => e.id === reg.exam);
                                        return (
                                            <div key={reg.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                    <div style={{ background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '1rem', borderRadius: '1rem' }}>
                                                        <FileText size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{exam?.title || 'Loading...'}</h4>
                                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }} className="text-muted">
                                                            <span><Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {exam?.date}</span>
                                                            <span><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {exam?.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                    {reg.payment_status ? (
                                                        <>
                                                            <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>Confirmed</div>
                                                            <button
                                                                onClick={() => handleDownloadHallTicket(reg.id)}
                                                                className="btn btn-primary btn-sm"
                                                                style={{ gap: '0.5rem' }}
                                                            >
                                                                <Download size={16} /> Hall Ticket
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div style={{ color: 'hsl(var(--error))', fontSize: '0.85rem', fontWeight: 'bold' }}>Payment Pending</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                                            <p className="text-muted">You haven't registered for any exams yet.</p>
                                            <Link to="/exams" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>View Available Exams</Link>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Recommended Study Flows */}
                            <section>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>AI Study Preparation</h2>
                                <div className="glass-card" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/0.05), transparent)' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <Sparkles size={24} className="text-gradient" />
                                        <h3>Ask EduAI for Study Strategy</h3>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            className="input"
                                            placeholder="What's the best way to prepare for Calculus?"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                        <button className="btn btn-primary" onClick={async () => {
                                            const res = await getAIAdvice(searchQuery);
                                            setAiAdvice(res.data.advice);
                                        }}>Get Advice</button>
                                    </div>
                                    {aiAdvice && (
                                        <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid hsl(var(--primary))' }}>
                                            <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{aiAdvice}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {/* 2. Staff Sections */}
                    {!user.is_student && (
                        <>
                            <section>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem' }}>Department Exams</h2>
                                    <button onClick={() => setShowExamModal(true)} className="btn btn-primary btn-sm">
                                        <Plus size={16} /> Create Schedule
                                    </button>
                                </div>
                                <div className="grid-cols-2">
                                    {exams.map(exam => (
                                        <div key={exam.id} className="glass-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <h4>{exam.title}</h4>
                                                <span className="badge badge-primary">{exam.capacity} Seats</span>
                                            </div>
                                            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{exam.date} at {exam.venue}</p>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>View List</button>
                                                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Profile Summary */}
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserIcon size={48} color="white" />
                        </div>
                        <h3 style={{ marginBottom: '0.25rem' }}>{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user.email}</p>
                        <Link to="/profile" className="btn btn-outline btn-sm" style={{ width: '100%' }}>View Profile</Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="glass-card">
                        <h4 style={{ marginBottom: '1.5rem' }}>System Health</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--success))' }} />
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Server Status</span>
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Active</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--success))' }} />
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Database</span>
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Synced</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--warning))' }} />
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>API Latency</span>
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>24ms</span>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility Notification */}
                    {user.is_student && (
                        <div className="glass-card" style={{ borderLeft: '4px solid hsl(var(--warning))' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <AlertTriangle size={20} style={{ color: 'hsl(var(--warning))', flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Doc Verification</h4>
                                    <p style={{ fontSize: '0.8rem' }} className="text-muted">Upload your 12th Marks-Sheet to finish high-priority eligibility checks.</p>
                                    <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%', fontSize: '0.75rem' }}>Upload Now</button>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Create Exam Modal (Reused and updated) */}
            {showExamModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card animate-fade-in" style={{ width: '550px', backgroundColor: 'hsl(var(--bg-dark))' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Schedule New Examination</h2>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={async (e) => {
                            e.preventDefault();
                            await createExam(newExam);
                            setShowExamModal(false);
                            fetchData();
                        }}>
                            <div className="form-group">
                                <label className="form-label">Exam Title</label>
                                <input className="input" required value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input type="date" className="input" required value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Time</label>
                                    <input type="time" className="input" required value={newExam.time} onChange={e => setNewExam({ ...newExam, time: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Venue / Hall</label>
                                <input className="input" required value={newExam.venue} onChange={e => setNewExam({ ...newExam, venue: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fee ($)</label>
                                <input type="number" className="input" required value={newExam.fee} onChange={e => setNewExam({ ...newExam, fee: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowExamModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Discard</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
