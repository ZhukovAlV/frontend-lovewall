import React, { useState, useEffect } from "react";
import { Comment, CreateCommentRequest } from "../models";
import { getComments, createComment, deleteComment } from "../api/wallApi";
import { isLoggedIn, getCurrentUserId } from "../auth";
import { formatDateShort } from "../utils/dateUtils";
import Button from "./Button";
import "./Comments.scss";

interface CommentsProps {
    messageId: number;
    commentsCount: number;
    onCommentsCountChange: (count: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ messageId, commentsCount, onCommentsCountChange }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loggedIn = isLoggedIn();
    const currentUserId = getCurrentUserId();

    const loadComments = async () => {
        if (!showComments) return;

        setLoading(true);
        try {
            const data = await getComments(messageId);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [showComments, messageId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !loggedIn) return;

        setSubmitting(true);
        try {
            const request: CreateCommentRequest = { text: newComment.trim() };
            const comment = await createComment(messageId, request);
            setComments(prev => [...prev, comment]);
            setNewComment("");
            onCommentsCountChange(commentsCount + 1);
        } catch (error) {
            console.error("Failed to create comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            onCommentsCountChange(Math.max(0, commentsCount - 1));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <div className="comments">
            <button
                className="comments-toggle"
                onClick={toggleComments}
                type="button"
            >
                💬 {commentsCount} {commentsCount === 1 ? 'комментарий' : 'комментариев'}
            </button>

            {showComments && (
                <div className="comments-section">
                    {loading ? (
                        <div className="comments-loading">Загрузка комментариев...</div>
                    ) : (
                        <>
                            <div className="comments-list">
                                {comments.length === 0 ? (
                                    <div className="no-comments">Пока нет комментариев</div>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <div className="comment-author">
                                                    {comment.userAvatarUrl && (
                                                        <img
                                                            src={comment.userAvatarUrl}
                                                            alt={comment.userName}
                                                            className="comment-avatar"
                                                        />
                                                    )}
                                                    <span className="comment-username">
                                                        {comment.userName || `Пользователь ${comment.userId}`}
                                                    </span>
                                                </div>
                                                <div className="comment-actions">
                                                    <span className="comment-date">
                                                        {formatDateShort(comment.createdAt)}
                                                    </span>
                                                    {currentUserId === comment.userId && (
                                                        <button
                                                            className="comment-delete"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            type="button"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="comment-text">{comment.text}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {loggedIn && (
                                <form className="comment-form" onSubmit={handleSubmitComment}>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Написать комментарий..."
                                        maxLength={512}
                                        rows={2}
                                        required
                                    />
                                    <Button type="submit" disabled={submitting || !newComment.trim()}>
                                        {submitting ? "Отправка..." : "Отправить"}
                                    </Button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Comments;