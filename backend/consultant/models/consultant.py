from datetime import datetime
from typing import List, Dict, Optional

class ConsultantModel:
    @staticmethod
    def create(data: Dict) -> Dict:
        return {
            "name": data.get("name"),
            "name_bn": data.get("name_bn", data.get("name")),
            "degree": data.get("degree"),
            "specialization": data.get("specialization", []),
            "experience_years": data.get("experience_years", 0),
            "division": data.get("division"),
            "district": data.get("district"),
            "address": data.get("address"),
            "fee": data.get("fee", 0),
            "rating": data.get("rating", 0),
            "total_reviews": data.get("total_reviews", 0),
            "available_days": data.get("available_days", []),
            "available_time_start": data.get("available_time_start", "09:00"),
            "available_time_end": data.get("available_time_end", "18:00"),
            "online_available": data.get("online_available", True),
            "phone": data.get("phone"),
            "email": data.get("email"),
            "bio": data.get("bio"),
            "bio_bn": data.get("bio_bn", data.get("bio")),
            "image": data.get("image", "/consultants/default.jpg"),
            "is_active": data.get("is_active", True),
            "created_at": datetime.utcnow()
        }
    
    @staticmethod
    def from_db(consultant: Dict) -> Dict:
        return {
            "id": str(consultant["_id"]),
            "name": consultant.get("name"),
            "name_bn": consultant.get("name_bn"),
            "degree": consultant.get("degree"),
            "specialization": consultant.get("specialization", []),
            "experience_years": consultant.get("experience_years", 0),
            "division": consultant.get("division"),
            "district": consultant.get("district"),
            "address": consultant.get("address"),
            "fee": consultant.get("fee", 0),
            "rating": consultant.get("rating", 0),
            "total_reviews": consultant.get("total_reviews", 0),
            "available_days": consultant.get("available_days", []),
            "available_time_start": consultant.get("available_time_start"),
            "available_time_end": consultant.get("available_time_end"),
            "online_available": consultant.get("online_available", True),
            "phone": consultant.get("phone"),
            "email": consultant.get("email"),
            "bio": consultant.get("bio"),
            "bio_bn": consultant.get("bio_bn"),
            "image": consultant.get("image"),
            "is_active": consultant.get("is_active", True)
        }

class BookingModel:
    @staticmethod
    def create(data: Dict) -> Dict:
        return {
            "consultant_id": data.get("consultant_id"),
            "user_id": data.get("user_id"),
            "user_name": data.get("user_name"),
            "user_email": data.get("user_email"),
            "user_phone": data.get("user_phone"),
            "date": data.get("date"),
            "time": data.get("time"),
            "type": data.get("type", "online"),
            "meeting_link": data.get("meeting_link"),
            "notes": data.get("notes"),
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    @staticmethod
    def from_db(booking: Dict) -> Dict:
        return {
            "id": str(booking["_id"]),
            "consultant_id": booking.get("consultant_id"),
            "user_id": booking.get("user_id"),
            "user_name": booking.get("user_name"),
            "user_email": booking.get("user_email"),
            "user_phone": booking.get("user_phone"),
            "date": booking.get("date"),
            "time": booking.get("time"),
            "type": booking.get("type"),
            "meeting_link": booking.get("meeting_link"),
            "notes": booking.get("notes"),
            "status": booking.get("status"),
            "created_at": booking.get("created_at")
        }

class ReviewModel:
    @staticmethod
    def create(data: Dict) -> Dict:
        return {
            "consultant_id": data.get("consultant_id"),
            "user_id": data.get("user_id"),
            "user_name": data.get("user_name"),
            "rating": data.get("rating", 5),
            "comment": data.get("comment"),
            "created_at": datetime.utcnow()
        }
    
    @staticmethod
    def from_db(review: Dict) -> Dict:
        return {
            "id": str(review["_id"]),
            "user_name": review.get("user_name"),
            "rating": review.get("rating"),
            "comment": review.get("comment"),
            "created_at": review.get("created_at")
        }
