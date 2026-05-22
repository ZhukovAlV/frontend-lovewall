import React, { useState, useEffect } from "react";
import { toggleLike, getLikeStatus } from "../api/wallApi";
import { isLoggedIn } from "../auth";
import "./LikeButton.scss";

interface LikeButtonProps {
    messageId: number;
    initialLikes: number;
    onLikesChange: (likes: number, isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ messageId, initialLikes, onLikesChange }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    const loggedIn = isLoggedIn();

    useEffect(() => {
        if (loggedIn) {
            loadLikeStatus();
        }
    }, [messageId, loggedIn]);

    const loadLikeStatus = async () => {
        try {
            const status = await getLikeStatus(messageId);
            setIsLiked(status.isLiked);
            setLikes(status.likesCount);
        } catch (error) {
            console.error("Failed to load like status:", error);
        }
    };

    const handleToggleLike = async () => {
        if (!loggedIn || loading) return;

        setLoading(true);
        try {
            const result = await toggleLike(messageId);
            setIsLiked(result.isLiked);
            setLikes(result.likesCount);
            onLikesChange(result.likesCount, result.isLiked);
        } catch (error) {
            console.error("Failed to toggle like:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`like-button ${isLiked ? 'liked' : ''} ${!loggedIn ? 'disabled' : ''}`}
            onClick={handleToggleLike}
            disabled={!loggedIn || loading}
            type="button"
            title={loggedIn ? (isLiked ? 'Убрать лайк' : 'Поставить лайк') : 'Войдите, чтобы ставить лайки'}
        >
            <span className="like-icon">
                {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="like-count">{likes}</span>
        </button>
    );
};

export default LikeButton;