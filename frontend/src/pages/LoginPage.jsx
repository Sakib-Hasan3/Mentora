import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const result = await login(email, password);
        
        if (result.success) {
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                const token = localStorage.getItem('token');
                if (token) {
                    localStorage.setItem('token_remember', token);
                }
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('token_remember');
            }
            navigate('/dashboard');
        } else {
            setError(result.error || 'ইমেইল বা পাসওয়ার্ড ভুল');
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-icon">🧠</div>
                <h2 className="login-title">স্বাগতম kembali</h2>
                <p className="login-subtitle">আপনার একাউন্টে লগইন করুন</p>
                
                {error && <div className="login-error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="login-input"
                        placeholder="ইমেইল ঠিকানা"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="পাসওয়ার্ড"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <div className="remember-me">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>আমাকে মনে রাখুন</span>
                        </label>
                        <a href="#" className="forgot-link">পাসওয়ার্ড ভুলে গেছেন?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'লগইন হচ্ছে...' : '🔐 লগইন করুন'}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>একাউন্ট নেই? <Link to="/signup">একাউন্ট তৈরি করুন</Link></p>
                </div>
                <Link to="/" className="home-link">← হোম পেজে ফিরুন</Link>
            </div>
        </div>
    );
};

export default LoginPage;