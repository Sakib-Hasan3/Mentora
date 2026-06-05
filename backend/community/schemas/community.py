from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CreatePost(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=1, max_length=5000)
    division: str
    district: Optional[str] = None
    is_anonymous: bool = False
    tags: List[str] = []

class UpdatePost(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None

class CreateComment(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    is_anonymous: bool = False

class PostResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_avatar: str
    division: str
    district: Optional[str]
    title: str
    content: str
    is_anonymous: bool
    likes_count: int
    comments_count: int
    tags: List[str]
    created_at: datetime
    updated_at: datetime

class CommentResponse(BaseModel):
    id: str
    user_name: str
    content: str
    likes_count: int
    created_at: datetime

class PostDetailResponse(BaseModel):
    post: PostResponse
    comments: List[CommentResponse]

class PostsListResponse(BaseModel):
    success: bool
    posts: List[PostResponse]
    total: int
    page: int
    limit: int

class DivisionsResponse(BaseModel):
    success: bool
    divisions: List[dict]
