import React, { useState, useEffect } from 'react';

const stats = [
    {
        number: 50000,
        label: "সক্রিয় ইউজার",
        icon: "👥",
        suffix: "+"
    },
    {
        number: 98,
        label: "সন্তুষ্টির হার",
        icon: "⭐",
        suffix: "%"
    },
    {
        number: 150,
        label: "বিশেষজ্ঞ সাইকোলজিস্ট",
        icon: "🎓",
        suffix: "+"
    },
    {
        number: 24,
        label: "ঘন্টা সাপোর্ট",
        icon: "🕐",
        suffix: "/৭"
    }
];

const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count.toLocaleString('bn-BD')}</span>;
};

const StatsSection = () => {
    return (
        <div className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="text-center text-white transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="text-5xl mb-3">
                                {stat.icon}
                            </div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">
                                <Counter end={stat.number} />
                                {stat.suffix}
                            </div>
                            <div className="text-lg opacity-95">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ইউজার রিভিউ ব্যাজ */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3">
                        <div className="flex -space-x-2">
                            {['👨', '👩', '👧', '👦'].map((emoji, i) => (
                                <div key={i} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm border-2 border-purple-600">
                                    {emoji}
                                </div>
                            ))}
                        </div>
                        <span className="text-white font-semibold">
                            ৫০০০+ মানুষ আমাদের উপর আস্থা রেখেছেন
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;