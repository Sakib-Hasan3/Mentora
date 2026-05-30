import React, { useEffect, useState } from 'react';

const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className={`max-w-6xl mx-auto text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                
                {/* ইমোজি + টাইটেল */}
                <div className="mb-6">
                    <span className="text-7xl inline-block animate-bounce">🧠</span>
                </div>
                
                {/* মেইন হেডিং */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                    আপনার মানসিক স্বাস্থ্যের
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                        বিশ্বস্ত সঙ্গী
                    </span>
                </h1>
                
                {/* সাবটাইটেল */}
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    আমরা বুঝি, মানসিক চাপ কতটা কষ্টের। বিনামূল্যে, নিরাপদ ও গোপনীয় মানসিক স্বাস্থ্য পরামর্শ নিন।
                </p>
                
                {/* CTA বাটন */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        🎯 এখনই মানসিক স্বাস্থ্য পরীক্ষা করুন
                    </button>
                    <button className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white font-semibold rounded-full text-lg hover:bg-white/30 transition-all duration-300">
                        📖 আরও জানুন
                    </button>
                </div>
                
                {/* ট্রাস্ট ব্যাজ */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-200">
                    <span className="flex items-center gap-2">🔒 ১০০% গোপনীয়</span>
                    <span className="flex items-center gap-2">💚 বিনামূল্যে</span>
                    <span className="flex items-center gap-2">🇧🇩 বাংলাদেশিদের জন্য</span>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;