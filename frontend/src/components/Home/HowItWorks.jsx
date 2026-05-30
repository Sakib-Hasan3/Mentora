import React from 'react';

const steps = [
    {
        number: "০১",
        icon: "📝",
        title: "আপনার অনুভূতি শেয়ার করুন",
        description: "আপনি কেমন অনুভব করছেন তা লিখে জানান। কিছু বলতে চাইলে লিখুন, না চাইলে প্রশ্নের উত্তর দিন।",
        color: "bg-blue-500"
    },
    {
        number: "০২",
        icon: "🧠",
        title: "এআই বিশ্লেষণ করুক",
        description: "আমাদের এআই মডেল আপনার অনুভূতি বিশ্লেষণ করে আপনার মানসিক অবস্থা বুঝবে।",
        color: "bg-purple-500"
    },
    {
        number: "০৩",
        icon: "💚",
        title: "ব্যক্তিগত পরামর্শ নিন",
        description: "আপনার মানসিক অবস্থার উপর ভিত্তি করে ব্যক্তিগত পরামর্শ ও নির্দেশনা পাবেন।",
        color: "bg-green-500"
    },
    {
        number: "০৪",
        icon: "📈",
        title: "অগ্রগতি ট্র্যাক করুন",
        description: "নিয়মিত ব্যবহারে আপনার মানসিক স্বাস্থ্যের উন্নতি দেখুন।",
        color: "bg-orange-500"
    }
];

const HowItWorks = () => {
    return (
        <div className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto">
                {/* সেকশন হেডার */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        🚀 কিভাবে <span className="text-purple-600">কাজ করে</span>?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        ৪টি সহজ ধাপে আপনার মানসিক স্বাস্থ্যের যত্ন নিন
                    </p>
                </div>

                {/* স্টেপস */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center"
                        >
                            {/* স্টেপ নাম্বার ব্যাজ */}
                            <div className="absolute -top-3 -left-3">
                                <div className={`${step.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                                    {step.number}
                                </div>
                            </div>
                            
                            {/* আইকন */}
                            <div className="text-6xl mb-4 mt-4">
                                {step.icon}
                            </div>
                            
                            {/* টাইটেল */}
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                {step.title}
                            </h3>
                            
                            {/* বিবরণ */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {/* কানেক্টিং লাইন (শুধু ডেস্কটপে) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-6 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* সিটিএ */}
                <div className="text-center mt-12">
                    <button className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg">
                        🎯 আজই শুরু করুন (বিনামূল্যে)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;