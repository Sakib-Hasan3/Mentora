from datetime import datetime
from typing import List, Dict, Optional
from bson import ObjectId

class PostModel:
    @staticmethod
    def create(data: Dict) -> Dict:
        return {
            "user_id": data.get("user_id"),
            "user_name": data.get("user_name"),
            "user_avatar": data.get("user_avatar", "🧑"),
            "division": data.get("division"),
            "district": data.get("district"),
            "title": data.get("title"),
            "content": data.get("content"),
            "is_anonymous": data.get("is_anonymous", False),
            "likes": [],
            "comments": [],
            "tags": data.get("tags", []),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    @staticmethod
    def from_db(post: Dict) -> Dict:
        return {
            "id": str(post["_id"]),
            "user_id": post.get("user_id"),
            "user_name": "অনামিকা" if post.get("is_anonymous") else post.get("user_name"),
            "user_avatar": "🤫" if post.get("is_anonymous") else post.get("user_avatar", "🧑"),
            "division": post.get("division"),
            "district": post.get("district"),
            "title": post.get("title"),
            "content": post.get("content"),
            "is_anonymous": post.get("is_anonymous", False),
            "likes_count": len(post.get("likes", [])),
            "comments_count": len(post.get("comments", [])),
            "tags": post.get("tags", []),
            "created_at": post.get("created_at"),
            "updated_at": post.get("updated_at")
        }

class CommentModel:
    @staticmethod
    def create(post_id: str, user_id: str, user_name: str, content: str, is_anonymous: bool = False) -> Dict:
        return {
            "id": str(ObjectId()),
            "post_id": post_id,
            "user_id": user_id,
            "user_name": "অনামিকা" if is_anonymous else user_name,
            "content": content,
            "is_anonymous": is_anonymous,
            "likes": [],
            "created_at": datetime.utcnow()
        }
    
    @staticmethod
    def from_db(comment: Dict) -> Dict:
        return {
            "id": comment.get("id"),
            "user_name": comment.get("user_name"),
            "content": comment.get("content"),
            "likes_count": len(comment.get("likes", [])),
            "created_at": comment.get("created_at")
        }
