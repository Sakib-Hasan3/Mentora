import React, { useState } from 'react';

const PostCard = ({ post, onLike, onComment, currentUser, formatDate }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        onComment(post.id, commentText);
        setCommentText('');
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-user">
                    <div className="post-avatar">{post.user_avatar}</div>
                    <div className="post-user-info">
                        <div className="post-user-name">{post.user_name}</div>
                        <div className="post-location">
                            📍 {post.division} {post.district && `, ${post.district}`}
                        </div>
                    </div>
                </div>
                <div className="post-time">{formatDate(post.created_at)}</div>
            </div>
            
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
            
            {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                    {post.tags.map((tag, idx) => (
                        <span key={idx} className="post-tag">#{tag}</span>
                    ))}
                </div>
            )}
            
            <div className="post-actions">
                <button 
                    className={`post-action-btn ${post.is_liked ? 'liked' : ''}`}
                    onClick={() => onLike(post.id)}
                >
                    ❤️ {post.likes_count || 0}
                </button>
                <button 
                    className="post-action-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    💬 {post.comments_count || 0}
                </button>
            </div>
            
            {showComments && (
                <div className="comments-section">
                    <div className="comment-form">
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="একটি মন্তব্য লিখুন..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button 
                            className="comment-submit"
                            onClick={handleAddComment}
                        >
                            পাঠান
                        </button>
                    </div>
                    <div className="comments-list">
                        {post.comments?.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-avatar">👤</div>
                                <div className="comment-content">
                                    <div className="comment-user">{comment.user_name}</div>
                                    <div className="comment-text">{comment.content}</div>
                                </div>
                            </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                            <div className="no-comments">কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
