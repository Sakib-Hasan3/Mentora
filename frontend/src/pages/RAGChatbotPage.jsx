import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/rag-chatbot-page.css';

const RAGChatbotPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const isPaid = user?.user_type === 'paid' || user?.subscription === 'premium';

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', content: input.trim(), time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input.trim();
        setInput('');
        setLoading(true);
        setTyping(true);

        try {
            const data = await api.post('/rag/chat', {
                message: currentInput,
                session_id: sessionId
            });
            const botMsg = {
                role: 'assistant',
                content: data.response,
                context_used: data.context_used,
                sources: data.sources,
                time: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setSessionId(data.session_id);
        } catch (error) {
            console.error('RAG error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'দুঃখিত, সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।',
                time: new Date(),
                isError: true
            }]);
        } finally {
            setLoading(false);
            setTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startNewChat = () => {
        if (messages.length > 0) {
            setSessions(prev => [{
                id: sessionId,
                preview: messages[messages.length - 1]?.content?.slice(0, 50) + '...',
                time: new Date()
            }, ...prev.slice(0, 9)]);
        }
        setMessages([]);
        setSessionId(null);
    };

    const quickQuestions = [
        { icon: '🧠', text: 'মানসিক স্বাস্থ্য বজায় রাখার উপায়?' },
        { icon: '😰', text: 'প্যানিক অ্যাটাক হলে কী করবো?' },
        { icon: '💊', text: 'এন্টিডিপ্রেসেন্ট ওষুধের পার্শ্বপ্রতিক্রিয়া?' }
    ];

    if (!isPaid) {
        return (
            <div className="rag-paywall-container">
                <div className="rag-paywall-card">
                    <h1 className="rag-paywall-title">RAG চ্যাটবট — প্রিমিয়াম ফিচার</h1>
                    <p className="rag-paywall-desc">
                        RAG (Retrieval-Augmented Generation) চ্যাটবট আমাদের মানসিক স্বাস্থ্য ডকুমেন্ট থেকে
                        তথ্য খুঁজে সঠিক ও বিস্তারিত উত্তর দেয়। এটি শুধুমাত্র Premium সদস্যদের জন্য।
                    </p>
                    <div className="rag-paywall-features">
                        {['📖 মানসিক স্বাস্থ্য ডাটাবেজ থেকে তথ্য', '🎯 সঠিক ও উৎস-ভিত্তিক উত্তর', '🔬 বৈজ্ঞানিক তথ্যের রেফারেন্স', '💾 চ্যাট হিস্ট্রি সেভ'].map((f, i) => (
                            <div key={i} className="rag-paywall-feature-item">
                                <span className="rag-paywall-check">✓</span> {f}
                            </div>
                        ))}
                    </div>
                    <div className="rag-paywall-pricing">
                        <div className="rag-paywall-price">৳২৯৯ <span className="rag-paywall-period">/মাস</span></div>
                        <div className="rag-paywall-price-sub">বা ৳২,৪৯৯/বছর (৩০% সাশ্রয়)</div>
                    </div>
                    <button onClick={() => navigate('/pricing')} className="rag-paywall-upgrade-btn">
                        👑 এখনই আপগ্রেড করুন
                    </button>
                    <button onClick={() => navigate('/support')} className="rag-paywall-free-btn">
                        বিনামূল্যে ২৪/৭ চ্যাট ব্যবহার করুন →
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="rag-paywall-back-btn">
                        ← ড্যাশবোর্ডে ফিরুন
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rag-chat-container" style={{paddingTop: '70px'}}>
            <Header />
            {/* Sidebar */}
            <div className="rag-chat-sidebar" style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
                <div className="rag-chat-sidebar-header">
                    <h3 className="rag-chat-sidebar-title">📋 চ্যাট হিস্ট্রি</h3>
                    <button onClick={() => setSidebarOpen(false)} className="rag-chat-close-btn">✖</button>
                </div>
                <button onClick={startNewChat} className="rag-chat-new-chat-side-btn">+ নতুন চ্যাট</button>
                <div className="rag-chat-session-list">
                    {sessions.map((s, i) => (
                        <div key={i} className="rag-chat-session-item">
                            <div className="rag-chat-session-preview">{s.preview}</div>
                            <div className="rag-chat-session-time">{s.time?.toLocaleDateString('bn-BD')}</div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <p className="rag-chat-no-history">কোনো পুরনো চ্যাট নেই</p>
                    )}
                </div>
            </div>
            {sidebarOpen && <div className="rag-chat-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Header */}
            <div className="rag-chat-header">
                <div className="rag-chat-header-left">
                    <button onClick={() => setSidebarOpen(true)} className="rag-chat-menu-btn">☰</button>
                    <button onClick={() => navigate('/dashboard')} className="rag-chat-back-btn">← ড্যাশবোর্ড</button>
                    <div className="rag-chat-header-info">
                        <div className="rag-chat-avatar">🧠</div>
                        <div>
                            <h2 className="rag-chat-header-title">RAG চ্যাটবট</h2>
                            <div className="rag-chat-header-sub">
                                <span className="rag-chat-online-dot"></span>
                                <span className="rag-chat-online-text">নলেজ বেস থেকে উত্তর দিচ্ছে</span>
                                <span className="rag-chat-paid-badge">👑 Premium</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={startNewChat} className="rag-chat-new-chat-btn">+ নতুন চ্যাট</button>
            </div>

            {/* Messages */}
            <div className="rag-chat-messages-area">
                {messages.length === 0 && (
                    <div className="rag-chat-empty-state">
                        <div className="rag-chat-empty-icon">🧠</div>
                        <h2 className="rag-chat-empty-title">RAG চ্যাটবট স্বাগত জানাচ্ছে!</h2>
                        <p className="rag-chat-empty-desc">
                            আমি মানসিক স্বাস্থ্য বিষয়ক ডকুমেন্ট থেকে তথ্য খুঁজে আপনার প্রশ্নের উত্তর দেই।
                        </p>
                        <div className="rag-chat-quick-grid">
                            {quickQuestions.map((q, idx) => (
                                <button key={idx} className="rag-chat-quick-btn"
                                    onClick={() => { setInput(q.text); inputRef.current?.focus(); }}>
                                    <span>{q.icon}</span>
                                    <span className="rag-chat-quick-text">{q.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className="rag-chat-msg-row" style={{
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                    }}>
                        <div className={msg.role === 'user' ? "rag-chat-user-avatar" : "rag-chat-bot-avatar"}>
                            {msg.role === 'user' ? (user?.name?.charAt(0) || 'আ') : '🧠'}
                        </div>
                        <div className={`rag-chat-bubble ${msg.role === 'user' ? "rag-chat-user-bubble" : "rag-chat-bot-bubble"}`}>
                            <p className="rag-chat-bubble-text">{msg.content}</p>
                            {msg.context_used && (
                                <div className="rag-chat-source-badge">📖 নলেজ বেস থেকে সংগ্রহ করা</div>
                            )}
                            <span className="rag-chat-time-text">
                                {msg.time && new Date(msg.time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {typing && (
                    <div className="rag-chat-msg-row" style={{ flexDirection: 'row' }}>
                        <div className="rag-chat-bot-avatar">🧠</div>
                        <div className="rag-chat-bubble rag-chat-bot-bubble">
                            <div className="rag-chat-typing">
                                <span className="rag-chat-dot"></span>
                                <span className="rag-chat-dot"></span>
                                <span className="rag-chat-dot"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="rag-chat-input-area">
                <div className="rag-chat-input-wrapper">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="মানসিক স্বাস্থ্য বিষয়ে প্রশ্ন করুন... (Enter পাঠান)"
                        className="rag-chat-textarea"
                        rows={2}
                        disabled={loading}
                    />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}
                        className="rag-chat-send-btn"
                        style={{ opacity: loading || !input.trim() ? 0.5 : 1 }}>
                        {loading ? '⏳' : '➤'}
                    </button>
                </div>
                <p className="rag-chat-disclaimer">
                    ⚠️ RAG চ্যাটবট পেশাদার চিকিৎসার বিকল্প নয়।
                    <button onClick={() => navigate('/consultants')} className="rag-chat-consult-link">
                        বিশেষজ্ঞের সাথে কথা বলুন →
                    </button>
                </p>
            </div>
        </div>
    );
};

const paywall = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1e, #0d1b2a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '3rem',
        maxWidth: '500px', width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
    },
    iconBig: { fontSize: '4rem', marginBottom: '1rem' },
    title: { color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '1rem' },
    desc: { color: '#a8c0b5', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' },
    features: { textAlign: 'left', marginBottom: '1.5rem' },
    featureItem: { color: '#c4d8cf', fontSize: '0.88rem', padding: '0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    check: { color: '#10b981', fontWeight: 700 },
    pricing: { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' },
    price: { color: '#f59e0b', fontSize: '2rem', fontWeight: 800 },
    period: { fontSize: '1rem', fontWeight: 400 },
    priceSub: { color: '#a8c0b5', fontSize: '0.8rem', marginTop: '0.25rem' },
    upgradeBtn: {
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        border: 'none', color: '#000', padding: '0.9rem 2rem',
        borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
        fontSize: '1rem', width: '100%', marginBottom: '0.75rem',
    },
    freeBtn: {
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
        color: '#10b981', padding: '0.7rem 2rem', borderRadius: '12px',
        cursor: 'pointer', fontSize: '0.88rem', width: '100%', marginBottom: '0.75rem',
    },
    backBtn: {
        background: 'none', border: 'none', color: '#6b8f7f',
        cursor: 'pointer', fontSize: '0.85rem',
    },
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1e, #0d1b2a)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Hind Siliguri', sans-serif",
    },
    sidebar: {
        position: 'fixed', left: 0, top: 0, height: '100vh',
        width: '280px', background: '#0d1425',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 200, transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column',
    },
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150,
    },
    sidebarHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    sidebarTitle: { color: '#e2e8f0', margin: 0, fontSize: '0.95rem' },
    closeBtn: { background: 'none', border: 'none', color: '#6b8f7f', cursor: 'pointer', fontSize: '1rem' },
    newChatSideBtn: {
        margin: '1rem', background: 'rgba(139,92,246,0.15)',
        border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6',
        padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem',
    },
    sessionList: { flex: 1, overflowY: 'auto', padding: '0 1rem' },
    sessionItem: {
        padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
        marginBottom: '0.5rem', background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
    },
    sessionPreview: { color: '#a8c0b5', fontSize: '0.8rem', marginBottom: '0.25rem' },
    sessionTime: { color: '#6b8f7f', fontSize: '0.7rem' },
    noHistory: { color: '#6b8f7f', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' },
    header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    menuBtn: {
        background: 'none', border: 'none', color: '#a8c0b5',
        cursor: 'pointer', fontSize: '1.2rem', padding: '0.3rem',
    },
    backBtn: {
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
        color: '#a8c0b5', padding: '0.4rem 0.9rem', borderRadius: '8px',
        cursor: 'pointer', fontSize: '0.82rem',
    },
    headerInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    ragAvatar: {
        width: '42px', height: '42px',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.3rem',
        boxShadow: '0 0 15px rgba(245,158,11,0.4)',
    },
    headerTitle: { margin: 0, fontSize: '1rem', color: '#e2e8f0', fontWeight: 700 },
    headerSub: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' },
    onlineDot: {
        width: '8px', height: '8px', background: '#f59e0b',
        borderRadius: '50%', boxShadow: '0 0 6px #f59e0b',
    },
    onlineText: { fontSize: '0.72rem', color: '#6b8f7f' },
    paidBadge: {
        background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
        color: '#f59e0b', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px',
    },
    newChatBtn: {
        background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
        color: '#f59e0b', padding: '0.4rem 0.9rem', borderRadius: '8px',
        cursor: 'pointer', fontSize: '0.82rem',
    },
    messagesArea: {
        flex: 1, overflowY: 'auto',
        padding: '1.5rem', maxWidth: '800px', width: '100%', margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: '1rem',
    },
    emptyState: { textAlign: 'center', padding: '2rem 0' },
    emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
    emptyTitle: { color: '#e2e8f0', fontSize: '1.3rem', marginBottom: '0.5rem' },
    emptyDesc: { color: '#a8c0b5', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 },
    quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' },
    quickBtn: {
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px', padding: '0.7rem', color: '#c4d8cf',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
        textAlign: 'left', fontSize: '0.82rem', transition: 'all 0.2s',
    },
    quickText: { lineHeight: 1.3 },
    msgRow: { display: 'flex', gap: '0.75rem', animation: 'fadeIn 0.3s ease' },
    userAvatar: {
        width: '36px', height: '36px', minWidth: '36px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 700, color: '#fff',
        fontSize: '0.9rem', alignSelf: 'flex-end',
    },
    botAvatar: {
        width: '36px', height: '36px', minWidth: '36px',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1rem', alignSelf: 'flex-end',
    },
    bubble: { maxWidth: '72%', padding: '0.9rem 1.1rem', borderRadius: '16px' },
    userBubble: { background: 'linear-gradient(135deg,#10b981,#059669)', borderBottomRightRadius: '4px' },
    botBubble: {
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
        borderBottomLeftRadius: '4px',
    },
    bubbleText: { margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 },
    sourceBadge: {
        marginTop: '0.5rem', fontSize: '0.65rem', padding: '2px 8px',
        background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '8px', color: '#f59e0b', display: 'inline-block',
    },
    timeText: { fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', display: 'block', marginTop: '4px' },
    typing: { display: 'flex', gap: '5px', padding: '4px 0' },
    dot: {
        width: '8px', height: '8px', background: '#6b7280',
        borderRadius: '50%', animation: 'bounce 1.4s infinite',
    },
    inputArea: {
        background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '1rem 1.5rem',
    },
    inputWrapper: {
        maxWidth: '800px', margin: '0 auto',
        display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px', padding: '0.75rem 1rem',
    },
    textarea: {
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: '#e2e8f0', fontSize: '0.9rem', resize: 'none',
        fontFamily: 'inherit', lineHeight: 1.5,
    },
    sendBtn: {
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        border: 'none', color: '#000', width: '42px', height: '42px',
        borderRadius: '10px', cursor: 'pointer', fontWeight: 700,
        fontSize: '1rem', flexShrink: 0, transition: 'all 0.2s',
    },
    disclaimer: {
        maxWidth: '800px', margin: '0.5rem auto 0', textAlign: 'center',
        fontSize: '0.72rem', color: '#6b8f7f',
    },
    consultLink: {
        background: 'none', border: 'none', color: '#10b981',
        cursor: 'pointer', textDecoration: 'underline', fontSize: '0.72rem',
        marginLeft: '0.3rem',
    },
};

export default RAGChatbotPage;
