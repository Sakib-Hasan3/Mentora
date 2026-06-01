import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import Header from '../components/Dashboard/Header';

const Assessment = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    
    const questions = [
        { id: 1, text: 'গত সপ্তাহে আপনি কতবার মন খারাপ অনুভব করেছেন?', options: ['কখনো না', '১-২ বার', '৩-৪ বার', 'প্রতিদিন'] },
        { id: 2, text: 'আপনার ঘুম কেমন হয়েছে?', options: ['ভালো', 'মাঝারি', 'খারাপ', 'একদমই না'] },
        { id: 3, text: 'কাজ/পড়ার প্রতি আগ্রহ কেমন?', options: ['স্বাভাবিক', 'কমেছে', 'অনেক কমেছে', 'একদম নেই'] },
        { id: 4, text: 'সামাজিক যোগাযোগ কেমন ছিল?', options: ['স্বাভাবিক', 'কমেছে', 'প্রায় নেই', 'একদমই না'] },
        { id: 5, text: 'আপনার চাপের মাত্রা কেমন?', options: ['কম', 'মাঝারি', 'বেশি', 'অতি বেশি'] },
    ];
    
    const handleAnswer = (answer) => {
        setAnswers({ ...answers, [currentQuestion]: answer });
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };
    
    const getResult = () => {
        // সিমুলেটেড রেজাল্ট
        const score = Object.keys(answers).length * 20;
        return {
            score: score,
            level: score > 60 ? 'উচ্চ ঝুঁকি' : score > 30 ? 'মাঝারি ঝুঁকি' : 'কম ঝুঁকি',
            advice: score > 60 ? 'দয়া করে একজন বিশেষজ্ঞের সাথে কথা বলুন' : 'নিয়মিত মেডিটেশন ও ব্যায়াম করুন'
        };
    };
    
    const isComplete = Object.keys(answers).length === questions.length;
    const result = isComplete ? getResult() : null;
    
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            
            <div className="flex-1 ml-64">
                <Header />
                
                <main className="p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <span className="text-5xl mb-4 block">🧠</span>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    মানসিক স্বাস্থ্য পরীক্ষা
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    ৫টি প্রশ্নের উত্তর দিন এবং আপনার মানসিক অবস্থা জানুন
                                </p>
                            </div>
                            
                            {!isComplete ? (
                                <>
                                    {/* প্রগ্রেস বার */}
                                    <div className="mb-8">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>প্রশ্ন {currentQuestion + 1} / {questions.length}</span>
                                            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% সম্পন্ন</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* প্রশ্ন */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                            {questions[currentQuestion].text}
                                        </h3>
                                        <div className="space-y-3">
                                            {questions[currentQuestion].options.map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleAnswer(option)}
                                                    className="w-full text-left p-4 border rounded-xl hover:bg-purple-50 hover:border-purple-300 transition"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* রেজাল্ট */}
                                    <div className="text-center">
                                        <div className="text-7xl mb-4 animate-bounce">
                                            {result.level === 'কম ঝুঁকি' ? '😊' : result.level === 'মাঝারি ঝুঁকি' ? '😐' : '😟'}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            আপনার ফলাফল: {result.level}
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                            স্কোর: {result.score}%
                                        </p>
                                        <div className="bg-purple-50 rounded-xl p-6 mb-6">
                                            <p className="text-purple-800">
                                                {result.advice}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCurrentQuestion(0);
                                                setAnswers({});
                                            }}
                                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                                        >
                                            আবার পরীক্ষা দিন
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Assessment;