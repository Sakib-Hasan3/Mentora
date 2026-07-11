import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/Header';
import '../styles/pricing.css';

const PricingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentStep, setPaymentStep] = useState(1);
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const isPaid = user?.user_type === 'paid' || user?.subscription === 'premium';

    const plans = {
        free: {
            name: 'বিনামূল্যে',
            icon: '🆓',
            price: { monthly: 0, yearly: 0 },
            color: 'rgba(16,185,129,0.15)',
            borderColor: 'rgba(16,185,129,0.3)',
            accentColor: '#10b981',
            features: [
                { text: '২৪/৭ সাপোর্ট চ্যাট (Groq AI)', included: true },
                { text: '৪ প্রশ্নের দ্রুত মানসিক স্বাস্থ্য পরীক্ষা', included: true },
                { text: 'বই জার্নাল পড়া', included: true },
                { text: 'কমিউনিটি গ্রুপ চ্যাট', included: true },
                { text: 'প্রগ্রেস ট্র্যাকিং', included: true },
                { text: '১৭ প্রশ্নের সম্পূর্ণ পরীক্ষা', included: false },
                { text: 'RAG চ্যাটবট (ডকুমেন্ট-ভিত্তিক)', included: false },
                { text: 'AI বিস্তারিত বিশ্লেষণ রিপোর্ট', included: false },
                { text: 'PDF রিপোর্ট ডাউনলোড', included: false },
                { text: 'অগ্রাধিকার সাপোর্ট', included: false },
            ]
        },
        premium: {
            name: 'প্রিমিয়াম',
            icon: '👑',
            price: { monthly: 299, yearly: 2499 },
            color: 'rgba(245,158,11,0.12)',
            borderColor: 'rgba(245,158,11,0.4)',
            accentColor: '#f59e0b',
            popular: true,
            features: [
                { text: '২৪/৭ সাপোর্ট চ্যাট (Groq AI)', included: true },
                { text: '৪ প্রশ্নের দ্রুত মানসিক স্বাস্থ্য পরীক্ষা', included: true },
                { text: 'বই জার্নাল পড়া', included: true },
                { text: 'কমিউনিটি গ্রুপ চ্যাট', included: true },
                { text: 'প্রগ্রেস ট্র্যাকিং', included: true },
                { text: '১৭ প্রশ্নের সম্পূর্ণ পরীক্ষা', included: true },
                { text: 'RAG চ্যাটবট (ডকুমেন্ট-ভিত্তিক)', included: true },
                { text: 'AI বিস্তারিত বিশ্লেষণ রিপোর্ট', included: true },
                { text: 'PDF রিপোর্ট ডাউনলোড', included: true },
                { text: 'অগ্রাধিকার সাপোর্ট', included: true },
            ]
        }
    };

    const handleUpgrade = (plan) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
        setPaymentStep(1);
        setSuccess(false);
    };

    const initiateSslCommerzPayment = async () => {
        setProcessing(true);
        try {
            const data = await api.post('/payment/initiate', { plan: billingCycle });
            if (data.success && data.gateway_url) {
                // Redirect user to SSLCommerz hosted checkout page
                window.location.href = data.gateway_url;
            } else {
                alert('পেমেন্ট শুরু করতে ব্যর্থ হয়েছে');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert(error.message || 'পেমেন্ট সংযোগ সমস্যা');
        } finally {
            setProcessing(false);
        }
    };

    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
        return digits;
    };

    const monthlyPrice = plans.premium.price.monthly;
    const yearlyPrice = plans.premium.price.yearly;
    const saving = Math.round(100 - (yearlyPrice / (monthlyPrice * 12)) * 100);

    return (
        <div className="pricing-container" style={{paddingTop: '70px'}}>
            <Header />
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="pricing-modal-overlay">
                    <div className="pricing-modal">
                        {paymentStep === 1 && (
                            <>
                                <h2 className="pricing-modal-title">📦 পরিকল্পনা নিশ্চিত করুন</h2>
                                <div className="pricing-order-summary">
                                    <div className="pricing-order-row">
                                        <span className="pricing-order-label">পরিকল্পনা</span>
                                        <span className="pricing-order-value">Premium {billingCycle === 'yearly' ? '(বার্ষিক)' : '(মাসিক)'}</span>
                                    </div>
                                    <div className="pricing-order-row">
                                        <span className="pricing-order-label">পরিমাণ</span>
                                        <span className="pricing-order-value" style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.2rem' }}>
                                            ৳{billingCycle === 'yearly' ? yearlyPrice.toLocaleString() : monthlyPrice}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <div className="pricing-saving-row">
                                            🎉 আপনি ৳{(monthlyPrice * 12 - yearlyPrice).toLocaleString()} সাশ্রয় করছেন!
                                        </div>
                                    )}
                                </div>
                                <div className="pricing-feature-preview">
                                    {['RAG চ্যাটবট', '১৭ প্রশ্নের পরীক্ষা', 'PDF রিপোর্ট', 'প্রিমিয়াম সাপোর্ট'].map((f, i) => (
                                        <span key={i} className="pricing-feature-tag">✓ {f}</span>
                                    ))}
                                </div>
                                <div className="pricing-modal-actions">
                                    <button 
                                        onClick={initiateSslCommerzPayment} 
                                        disabled={processing}
                                        className="pricing-proceed-btn"
                                        style={{ opacity: processing ? 0.7 : 1 }}
                                    >
                                        {processing ? '⏳ পেমেন্ট লোড হচ্ছে...' : '💳 SSLCommerz (বিকাশ, নগদ, রকেট) দিয়ে পেমেন্ট করুন'}
                                    </button>
                                    <button onClick={() => setShowPaymentModal(false)} className="pricing-cancel-btn" disabled={processing}>বাতিল</button>
                                </div>
                            </>
                        )}

                        {paymentStep === 2 && (
                            <>
                                <h2 className="pricing-modal-title">💳 পেমেন্ট তথ্য</h2>
                                <div className="pricing-card-preview">
                                    <div className="pricing-card-brand">💳 VISA / MasterCard</div>
                                    <div className="pricing-card-num">{cardData.number || '•••• •••• •••• ••••'}</div>
                                    <div className="pricing-card-bottom">
                                        <span>{cardData.name || 'কার্ডধারীর নাম'}</span>
                                        <span>{cardData.expiry || 'MM/YY'}</span>
                                    </div>
                                </div>
                                <div className="pricing-form-group">
                                    <label className="pricing-label">কার্ড নম্বর</label>
                                    <input
                                        className="pricing-input"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardData.number}
                                        onChange={e => setCardData(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                                        maxLength={19}
                                    />
                                </div>
                                <div className="pricing-form-group">
                                    <label className="pricing-label">কার্ডধারীর নাম</label>
                                    <input
                                        className="pricing-input"
                                        placeholder="Md. John Doe"
                                        value={cardData.name}
                                        onChange={e => setCardData(p => ({ ...p, name: e.target.value }))}
                                    />
                                </div>
                                <div className="pricing-form-row">
                                    <div className="pricing-form-group">
                                        <label className="pricing-label">মেয়াদ শেষ</label>
                                        <input
                                            className="pricing-input"
                                            placeholder="MM/YY"
                                            value={cardData.expiry}
                                            onChange={e => setCardData(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="pricing-form-group">
                                        <label className="pricing-label">CVV</label>
                                        <input
                                            className="pricing-input"
                                            placeholder="•••"
                                            type="password"
                                            value={cardData.cvv}
                                            onChange={e => setCardData(p => ({ ...p, cvv: e.target.value.slice(0, 3) }))}
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                                <div className="pricing-secure-note">🔒 আপনার তথ্য SSL এনক্রিপ্টেড ও নিরাপদ</div>
                                <div className="pricing-modal-actions">
                                    <button
                                        onClick={processPayment}
                                        disabled={processing || !cardData.number || !cardData.name}
                                        className="pricing-proceed-btn"
                                        style={{ opacity: processing ? 0.7 : 1 }}
                                    >
                                        {processing ? '⏳ প্রক্রিয়া হচ্ছে...' : `✅ ৳${billingCycle === 'yearly' ? yearlyPrice.toLocaleString() : monthlyPrice} পরিশোধ করুন`}
                                    </button>
                                    <button onClick={() => setPaymentStep(1)} className="pricing-cancel-btn">← পিছনে</button>
                                </div>
                            </>
                        )}

                        {paymentStep === 3 && success && (
                            <>
                                <div className="pricing-success-icon">🎉</div>
                                <h2 className="pricing-modal-title">পেমেন্ট সফল হয়েছে!</h2>
                                <p className="pricing-success-desc">
                                    আপনার Premium সদস্যপদ সক্রিয় হয়েছে। এখন থেকে সমস্ত প্রিমিয়াম ফিচার ব্যবহার করতে পারবেন।
                                </p>
                                <div className="pricing-success-features">
                                    {['✓ RAG চ্যাটবট', '✓ ১৭ প্রশ্নের পরীক্ষা', '✓ PDF রিপোর্ট'].map((f, i) => (
                                        <div key={i} className="pricing-success-feature-item">{f}</div>
                                    ))}
                                </div>
                                <div className="pricing-modal-actions">
                                    <button onClick={() => navigate('/rag-chatbot')} className="pricing-proceed-btn">
                                        🧠 RAG চ্যাটবট ব্যবহার করুন →
                                    </button>
                                    <button onClick={() => navigate('/dashboard')} className="pricing-cancel-btn">
                                        ড্যাশবোর্ডে যান
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="pricing-header">
                <button onClick={() => navigate('/dashboard')} className="pricing-back-btn">← ড্যাশবোর্ড</button>
            </div>

            {/* Hero */}
            <div className="pricing-hero">
                <div className="pricing-hero-label">💰 মূল্য পরিকল্পনা</div>
                <h1 className="pricing-hero-title">আপনার মানসিক স্বাস্থ্যে বিনিয়োগ করুন</h1>
                <p className="pricing-hero-desc">সহজ ও স্বচ্ছ মূল্য নীতি। যেকোনো সময় বাতিল করুন।</p>

                {/* Billing Toggle */}
                <div className="pricing-billing-toggle">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`pricing-billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                    >
                        মাসিক
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`pricing-billing-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                    >
                        বার্ষিক
                        <span className="pricing-save-badge">{saving}% সাশ্রয়</span>
                    </button>
                </div>
            </div>

            {/* Plans */}
            <div className="pricing-plans-grid">
                {Object.entries(plans).map(([key, plan]) => (
                    <div key={key} 
                        className={`pricing-plan-card ${plan.popular ? 'popular' : ''}`}
                        style={{
                            background: plan.color,
                            border: `1px solid ${plan.borderColor}`
                        }}
                    >
                        {plan.popular && (
                            <div className="pricing-popular-badge">⭐ সর্বাধিক জনপ্রিয়</div>
                        )}
                        <div className="pricing-plan-icon">{plan.icon}</div>
                        <h2 className="pricing-plan-name" style={{ color: plan.accentColor }}>{plan.name}</h2>

                        <div className="pricing-price-display">
                            {plan.price.monthly === 0 ? (
                                <span className="pricing-free-price">বিনামূল্যে</span>
                            ) : (
                                <>
                                    <span className="pricing-currency">৳</span>
                                    <span className="pricing-price-num">
                                        {billingCycle === 'yearly'
                                            ? Math.round(plan.price.yearly / 12)
                                            : plan.price.monthly}
                                    </span>
                                    <span className="pricing-price-period">/মাস</span>
                                </>
                            )}
                        </div>
                        {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                            <div className="pricing-yearly-note">৳{plan.price.yearly.toLocaleString()} বার্ষিক বিল</div>
                        )}

                        <ul className="pricing-feature-list">
                            {plan.features.map((f, i) => (
                                <li key={i} className={`pricing-feature-item ${f.included ? '' : 'excluded'}`}>
                                    <span style={{ color: f.included ? plan.accentColor : '#4b5563', marginRight: '0.6rem' }}>
                                        {f.included ? '✓' : '✗'}
                                    </span>
                                    {f.text}
                                </li>
                            ))}
                        </ul>

                        {key === 'free' ? (
                            isPaid ? (
                                <div className="pricing-current-plan-btn" style={{ borderColor: plan.borderColor, color: plan.accentColor }}>
                                    ✓ বর্তমান পরিকল্পনা নয়
                                </div>
                            ) : (
                                <div className="pricing-current-plan-btn" style={{ borderColor: plan.borderColor, color: plan.accentColor }}>
                                    ✓ আপনার বর্তমান পরিকল্পনা
                                </div>
                            )
                        ) : (
                            isPaid ? (
                                <div className="pricing-current-plan-btn" style={{ borderColor: plan.borderColor, color: plan.accentColor }}>
                                    👑 আপনার বর্তমান Premium পরিকল্পনা
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade('premium')}
                                    className="pricing-upgrade-btn"
                                    style={{ background: `linear-gradient(135deg, ${plan.accentColor}, #d97706)` }}
                                >
                                    👑 আপগ্রেড করুন →
                                </button>
                            )
                        )}
                    </div>
                ))}
            </div>

            {/* Consultant Section */}
            <div className="pricing-consultant-section">
                <h2 className="pricing-consultant-title">🧑‍⚕️ কনসালট্যান্ট অ্যাপয়েন্টমেন্ট</h2>
                <p className="pricing-consultant-desc">
                    বিশেষজ্ঞ মানসিক স্বাস্থ্য পরামর্শদাতার সাথে সরাসরি কথা বলুন।
                    Free এবং Premium উভয় সদস্যদের জন্য উপলব্ধ।
                </p>
                <div className="pricing-consultant-cards">
                    <div className="pricing-consultant-card">
                        <div className="pricing-consultant-icon">🖥️</div>
                        <h3 className="pricing-consultant-card-title">অনলাইন সেশন</h3>
                        <div className="pricing-consultant-price">৳৫০০ <span className="pricing-consultant-per">/সেশন</span></div>
                        <p className="pricing-consultant-card-desc">ভিডিও/অডিও কলে বিশেষজ্ঞের সাথে কথা বলুন</p>
                        <button onClick={() => navigate('/consultants')} className="pricing-book-btn">বুক করুন →</button>
                    </div>
                    <div className="pricing-consultant-card">
                        <div className="pricing-consultant-icon">🏢</div>
                        <h3 className="pricing-consultant-card-title">সরাসরি সেশন</h3>
                        <div className="pricing-consultant-price">৳৮০০ <span className="pricing-consultant-per">/সেশন</span></div>
                        <p className="pricing-consultant-card-desc">সরাসরি চেম্বারে গিয়ে বিশেষজ্ঞের সাথে দেখা করুন</p>
                        <button onClick={() => navigate('/consultants')} className="pricing-book-btn">বুক করুন →</button>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="pricing-faq">
                <h2 className="pricing-faq-title">❓ সাধারণ প্রশ্নাবলী</h2>
                {[
                    { q: 'Premium প্ল্যান বাতিল করা যাবে?', a: 'হ্যাঁ, যেকোনো সময় বাতিল করতে পারবেন। বাতিলের পর মেয়াদ শেষ পর্যন্ত Premium সুবিধা পাবেন।' },
                    { q: 'RAG চ্যাটবট কী?', a: 'RAG (Retrieval-Augmented Generation) চ্যাটবট আমাদের মানসিক স্বাস্থ্য বিষয়ক ডকুমেন্ট থেকে তথ্য খুঁজে সঠিক উত্তর দেয়।' },
                    { q: 'কনসালট্যান্ট বুকিং করলে কি টাকা ফেরত পাওয়া যায়?', a: '২৪ ঘণ্টা আগে বাতিল করলে সম্পূর্ণ টাকা ফেরত পাবেন।' },
                ].map((item, i) => (
                    <div key={i} className="pricing-faq-item">
                        <h4 className="pricing-faq-q">{item.q}</h4>
                        <p className="pricing-faq-a">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {};

export default PricingPage;
