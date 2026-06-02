from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class Question(BaseModel):
    id: int
    text: str
    options: List[str]

class AssessmentSubmit(BaseModel):
    answers: List[Dict] = Field(..., description="User's answers to questions")
    
    class Config:
        json_schema_extra = {
            "example": {
                "answers": [
                    {"question_id": 1, "question": "গত সপ্তাহে কেমন অনুভব করেছেন?", "answer": "স্বাভাবিক"},
                    {"question_id": 2, "question": "ঘুম কেমন হয়েছে?", "answer": "ভালো"}
                ]
            }
        }

class AssessmentResponse(BaseModel):
    success: bool
    message: str
    assessment_id: Optional[str] = None
    score: Optional[int] = None
    level: Optional[str] = None
    advice: Optional[str] = None

class AssessmentResult(BaseModel):
    id: str
    score: int
    level: str
    advice: str
    date: str
    answers: List[Dict]

class AssessmentStats(BaseModel):
    total: int
    average_score: int
    best_score: int
    worst_score: int
    trend: str
    last_assessment: Optional[datetime]
    improvement: int
    levels: Dict[str, int]

class AssessmentListResponse(BaseModel):
    success: bool
    assessments: List[AssessmentResult]
    stats: AssessmentStats