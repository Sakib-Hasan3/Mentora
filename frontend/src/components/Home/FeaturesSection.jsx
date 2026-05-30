import React from 'react';

const features = [
    {
        icon: "🤖",
        title: "এআই-চালিত বিশ্লেষণ",
        description: "আর্টিফিশিয়াল ইন্টেলিজেন্স ব্যবহার করে আপনার মানসিক অবস্থার সঠিক বিশ্লেষণ",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: "🔒",
        title: "১০০% গোপনীয়",
        description: "আপনার তথ্য সম্পূর্ণ নিরাপদ। কেউ দেখতে পাবে না, শেয়ার করা হবে না",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: "💬",
        title: "২৪/৭ সাপোর্ট",
        description: "যেকোনো সময়, যেকোনো জায়গা থেকে আমাদের সেবা নিতে পারবেন",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: "📊",
        title: "প্রতিদিনের ট্র্যাকিং",
        description: "নিয়মিত আপনার মানসিক স্বাস্থ্যের উন্নতি পর্যবেক্ষণ করুন",
        color: "from-orange-500 to-red-500"
    },
    {
        icon: "👥",
        title: "কমিউনিটি সাপোর্ট",
        description: "একই অভিজ্ঞতা সম্পন্ন মানুষদের সাথে সংযোগ স্থাপন করুন",
        color: "from-indigo-500 to-purple-500"
    },
    {
        icon: "📱",
        title: "মোবাইল ফ্রেন্ডলি",
        description: "যেকোনো ডিভাইস থেকে সহজেই ব্যবহার করতে পারবেন",
        color: "from-pink-500 to-rose-500"
    }
];

const FeaturesSection = () => {
    return (
        <div className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* সেকশন হেডার */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        🌟 কেন বেছে নেবেন <span className="text-purple-600">মেন্টাল সাথী</span>?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        আমরা তৈরি করেছি সহজ, নিরাপদ ও কার্যকর কিছু ফিচার যা আপনার মানসিক স্বাস্থ্যের যত্ন নেবে
                    </p>
                </div>

                {/* ফিচার গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;