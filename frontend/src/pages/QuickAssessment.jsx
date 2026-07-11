import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MentalHealthCheck from '../components/AssessmentWidget/MentalHealthCheck';
import FullAssessment from '../components/AssessmentWidget/FullAssessment';
import Header from '../components/Header';
import '../styles/quick-assessment.css';

const QuickAssessment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('quick');
    const [showPaywall, setShowPaywall] = useState(false);

    if (!user) { navigate('/login'); return null; }

    const isPaid = user?.user_type === 'paid' || user?.subscription === 'premium';

    return (
        <>
            <Header />
            {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} navigate={navigate} />}

            <div className="qa-page">
                {/* Background */}
                <div className="qa-glow-1" />
                <div className="qa-glow-2" />

                <div className="qa-container">
                    {/* Back + Tabs */}
                    <div className="qa-topbar">
                        <button onClick={() => navigate('/dashboard')} className="qa-backbtn">
                            ← ড্যাশবোর্ড
                        </button>
                        <div className="qa-tabs">
                            <button
                                className={`qa-tab ${mode === 'quick' ? 'active' : ''}`}
                                onClick={() => setMode('quick')}
                            >
                                ⚡ দ্রুত পরীক্ষা
                                <span className="qa-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>🆓 FREE</span>
                            </button>
                            <button
                                className={`qa-tab ${mode === 'full' && isPaid ? 'active' : ''} ${!isPaid ? 'locked' : ''}`}
                                onClick={() => isPaid ? setMode('full') : setShowPaywall(true)}
                            >
                                📋 সম্পূর্ণ পরীক্ষা
                                <span className="qa-badge" style={{ background: isPaid ? 'rgba(245,158,11,0.15)' : 'rgba(107,114,128,0.15)', color: isPaid ? '#f59e0b' : '#9ca3af', border: `1px solid ${isPaid ? 'rgba(245,158,11,0.3)' : 'rgba(107,114,128,0.2)'}` }}>
                                    {isPaid ? '👑 Active' : '🔒 Premium'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Plan Banner */}
                    {!isPaid && (
                        <div className="qa-banner">
                            <span>🆓 আপনি বিনামূল্যে প্ল্যানে আছেন — <strong style={{ color: '#10b981' }}>৪ প্রশ্নের দ্রুত পরীক্ষা</strong> উপলব্ধ</span>
                            <button onClick={() => navigate('/pricing')} className="qa-upgradebtn">
                                👑 Premium পান →
                            </button>
                        </div>
                    )}
                    {isPaid && (
                        <div className="qa-banner" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
                            <span style={{ color: '#f59e0b' }}>👑 Premium সক্রিয় — সমস্ত পরীক্ষা উপলব্ধ</span>
                        </div>
                    )}

                    {/* Assessment Content */}
                    <div className="qa-content-card">
                        {mode === 'quick' ? <MentalHealthCheck /> : <FullAssessment />}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ── Paywall Modal ─────────────────────────────────────────── */
const PaywallModal = ({ onClose, navigate }) => (
    <div className="qa-modal-overlay">
        <div className="qa-modal">
            <button className="qa-modal-close" onClick={onClose}>✕</button>
            <div className="qa-modal-icon">🔒</div>
            <h2 className="qa-modal-title">সম্পূর্ণ পরীক্ষা — প্রিমিয়াম ফিচার</h2>
            <p className="qa-modal-desc">
                ১৭ প্রশ্নের সম্পূর্ণ মানসিক স্বাস্থ্য পরীক্ষা শুধুমাত্র Premium সদস্যদের জন্য।
            </p>
            <div className="qa-modal-plans">
                <div className="qa-modal-plan">
                    <div className="qa-plan-head">🆓 বিনামূল্যে</div>
                    <div className="qa-plan-item">✅ ৪ প্রশ্নের দ্রুত পরীক্ষা</div>
                    <div className="qa-plan-item">✅ প্রাথমিক ঝুঁকি বিশ্লেষণ</div>
                    <div className="qa-plan-item">✅ ২৪/৭ সাপোর্ট চ্যাট</div>
                    <div className="qa-plan-item" style={{ color: '#ef4444' }}>✗ ১৭ প্রশ্নের পরীক্ষা</div>
                    <div className="qa-plan-item" style={{ color: '#ef4444' }}>✗ PDF রিপোর্ট</div>
                </div>
                <div className="qa-modal-plan premium">
                    <div className="qa-plan-head">👑 Premium — ৳২৯৯/মাস</div>
                    <div className="qa-plan-item">✅ ৪ প্রশ্নের দ্রুত পরীক্ষা</div>
                    <div className="qa-plan-item">✅ ১৭ প্রশ্নের সম্পূর্ণ পরীক্ষা</div>
                    <div className="qa-plan-item">✅ বিস্তারিত AI বিশ্লেষণ</div>
                    <div className="qa-plan-item">✅ RAG চ্যাটবট সেবা</div>
                    <div className="qa-plan-item">✅ PDF রিপোর্ট ডাউনলোড</div>
                </div>
            </div>
            <button onClick={() => navigate('/pricing')} className="qa-modal-upgradebtn">
                👑 আপগ্রেড করুন — ৳২৯৯/মাস
            </button>
            <button onClick={onClose} className="qa-modal-cancelbtn">বিনামূল্যে পরীক্ষা দিন</button>
        </div>
    </div>
);

export default QuickAssessment;