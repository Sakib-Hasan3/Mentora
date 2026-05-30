import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    
                    {/* কোম্পানি সম্পর্কে */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🧠</span>
                            <h3 className="text-xl font-bold">মেন্টাল সাথী</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            আপনার মানসিক স্বাস্থ্যের যত্ন নেওয়ার জন্য বাংলা প্ল্যাটফর্ম। আমরা বিশ্বাস করি, মানসিক সুস্থতা সবার অধিকার।
                        </p>
                    </div>

                    {/* দ্রুত লিংক */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">দ্রুত লিংক</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition">হোম</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">মানসিক স্বাস্থ্য পরীক্ষা</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">বিশেষজ্ঞদের তালিকা</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">ব্লগ</a></li>
                        </ul>
                    </div>

                    {/* সাপোর্ট */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">সাপোর্ট</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition">হেল্প সেন্টার</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">প্রাইভেসি পলিসি</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">টার্মস এন্ড কন্ডিশন</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">যোগাযোগ</a></li>
                        </ul>
                    </div>

                    {/* যোগাযোগ */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">যোগাযোগ</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2">📧 support@mentalsathi.com</li>
                            <li className="flex items-center gap-2">📞 ১৬২৬৩ (জাতীয় হেল্পলাইন)</li>
                            <li className="flex items-center gap-2">🇧🇩 বাংলাদেশ</li>
                        </ul>
                        
                        {/* সোশ্যাল লিংক */}
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">📘</a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">🐦</a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">📸</a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">💼</a>
                        </div>
                    </div>
                </div>

                {/* কপিরাইট */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    <p>© {currentYear} মেন্টাল সাথী। সব অধিকার সংরক্ষিত।</p>
                    <p className="mt-2">💚 আপনার মানসিক স্বাস্থ্যই আমাদের প্রথম priority</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;