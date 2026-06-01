import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const readAuth = () => {
    try {
        const stored = window.localStorage.getItem('mentora_auth') || window.sessionStorage.getItem('mentora_auth');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(() => readAuth());

    useEffect(() => {
        if (!auth?.token) {
            navigate('/login', { replace: true });
        }
    }, [auth, navigate]);

    const displayName = useMemo(() => auth?.user?.name || 'Mentora User', [auth]);
    const displayEmail = useMemo(() => auth?.user?.email || 'আপনার ইমেইল', [auth]);

    const handleLogout = () => {
        window.localStorage.removeItem('mentora_auth');
        window.sessionStorage.removeItem('mentora_auth');
        setAuth(null);
        navigate('/login', { replace: true });
    };

    if (!auth?.token) {
        return null;
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-shell container">
                <div className="dashboard-header">
                    <div>
                        <span className="section-kicker">আপনার Dashboard</span>
                        <h1>স্বাগতম, {displayName}</h1>
                        <p>{displayEmail}</p>
                    </div>

                    <div className="dashboard-actions">
                        <Link className="btn btn-secondary" to="/">
                            হোম
                        </Link>
                        <button className="btn btn-primary" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="dashboard-grid-main">
                    <article className="dashboard-card-panel">
                        <span className="insight-label">সেশন status</span>
                        <h2>আপনার account ready</h2>
                        <p>
                            আপনি সফলভাবে login করেছেন। এখন mood check-in, journaling, আর daily support features শুরু করতে পারেন।
                        </p>
                    </article>

                    <article className="dashboard-card-panel dashboard-card-highlight">
                        <span className="insight-label">সারাংশ</span>
                        <h2>আজকের focus</h2>
                        <ul>
                            <li>একবার শ্বাস-প্রশ্বাস অনুশীলন করুন</li>
                            <li>আপনার mood note লিখে রাখুন</li>
                            <li>রাতে স্ক্রিন টাইম একটু কমান</li>
                        </ul>
                    </article>
                </div>
            </section>
        </main>
    );
};

export default DashboardPage;