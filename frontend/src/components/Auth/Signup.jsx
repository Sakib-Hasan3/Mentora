import React, { useState } from 'react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // ইনপুট চেঞ্জ হ্যান্ডলার
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // ফিল্ড এডিট করলে এরর ক্লিয়ার করুন
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ফর্ম ভ্যালিডেশন
    const validateForm = () => {
        const newErrors = {};
        
        // নাম ভ্যালিডেশন
        if (!formData.name.trim()) {
            newErrors.name = 'আপনার নাম দিন';
        } else if (formData.name.length < 2) {
            newErrors.name = 'নাম কমপক্ষে ২ অক্ষরের হতে হবে';
        }
        
        // ইমেইল ভ্যালিডেশন
        if (!formData.email.trim()) {
            newErrors.email = 'ইমেইল ঠিকানা দিন';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন (যেমন: name@example.com)';
        }
        
        // মোবাইল ভ্যালিডেশন (অপশনাল)
        if (formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone)) {
            newErrors.phone = 'সঠিক মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
        }
        
        // পাসওয়ার্ড ভ্যালিডেশন
        if (!formData.password) {
            newErrors.password = 'পাসওয়ার্ড দিন';
        } else if (formData.password.length < 6) {
            newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
        }
        
        // কনফার্ম পাসওয়ার্ড ভ্যালিডেশন
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'পাসওয়ার্ড দুটি মিলছে না';
        }
        
        return newErrors;
    };

    // ফর্ম সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setIsLoading(true);
        
        // এখানে ব্যাকএন্ডে ডাটা পাঠানোর কোড আসবে
        // বর্তমানে শুধু UI দেখানোর জন্য সিমুলেট করছি
        setTimeout(() => {
            setSuccessMessage('🎉 একাউন্ট সফলভাবে তৈরি হয়েছে!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
            setIsLoading(false);
            
            // ৩ সেকেন্ড后 মেসেজ ক্লিয়ার
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 animate-fadeInUp">
                
                {/* হেডার */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <span className="text-7xl animate-bounce">🧠</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        একাউন্ট তৈরি করুন
                    </h2>
                    <p className="text-gray-500">
                        বিনামূল্যে সাইনআপ করুন এবং শুরু করুন
                    </p>
                </div>

                {/* সাকসেস মেসেজ */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                        {successMessage}
                    </div>
                )}

                {/* ফর্ম */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* নাম ফিল্ড */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            আপনার নাম <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="জন Doe"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* ইমেইল ফিল্ড */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ইমেইল ঠিকানা <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* মোবাইল ফিল্ড */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            মোবাইল নম্বর <span className="text-gray-400 text-xs">(অপশনাল)</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="০১XXXXXXXXX"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* পাসওয়ার্ড ফিল্ড */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            পাসওয়ার্ড <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.password}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                            পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে
                        </p>
                    </div>

                    {/* কনফার্ম পাসওয়ার্ড ফিল্ড */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* টার্মস এন্ড কন্ডিশন */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            আমি <a href="#" className="text-purple-600 hover:underline">টার্মস এন্ড কন্ডিশন</a> মেনে নিচ্ছি
                        </label>
                    </div>

                    {/* সাইনআপ বাটন */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span>
                                একাউন্ট তৈরি হচ্ছে...
                            </span>
                        ) : (
                            '🎉 একাউন্ট তৈরি করুন'
                        )}
                    </button>

                    {/* লগইন লিংক */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-600">
                            ইতিমধ্যে একাউন্ট আছে?{' '}
                            <a href="#" className="font-semibold text-purple-600 hover:text-purple-700">
                                লগইন করুন
                            </a>
                        </p>
                    </div>
                </form>

                {/* অল্টারনেটিভ সাইনআপ */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">অথবা সাইনআপ করুন</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <span>📱</span> মোবাইল
                        </button>
                        <button className="flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <span>🔑</span> OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;