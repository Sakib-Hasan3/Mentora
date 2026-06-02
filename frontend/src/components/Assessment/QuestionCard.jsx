import React from 'react';

const QuestionCard = ({ question, currentQuestion, totalQuestions, selectedAnswer, onAnswer, onNext, onPrevious }) => {
    const emojis = ['😊', '🙂', '😐', '😟'];

    return (
        <div className="question-section">
            <h2 className="question-text">{question?.text}</h2>
            <div className="options-grid">
                {question?.options?.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    return (
                        <button
                            key={idx}
                            onClick={() => onAnswer(option)}
                            className={`option-card ${isSelected ? 'selected' : ''}`}
                        >
                            <span className="option-emoji">{emojis[idx] || '📝'}</span>
                            <span className="option-text">{option}</span>
                        </button>
                    );
                })}
            </div>
            
            <div className="navigation-buttons">
                <button 
                    onClick={onPrevious}
                    disabled={currentQuestion === 0}
                    className="nav-btn"
                >
                    ← আগের প্রশ্ন
                </button>
                
                {currentQuestion === totalQuestions - 1 ? (
                    <button 
                        onClick={onNext}
                        disabled={!selectedAnswer}
                        className="nav-btn primary"
                    >
                        ✅ সাবমিট করুন
                    </button>
                ) : (
                    <button 
                        onClick={onNext}
                        disabled={!selectedAnswer}
                        className="nav-btn primary"
                    >
                        পরবর্তী প্রশ্ন →
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;