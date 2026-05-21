import React, { useState } from "react";
import { WallMessage } from "../models";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import "./WallFeed.scss";

type Props = {
    messages: WallMessage[];
    onMessageUpdate?: (message: WallMessage) => void;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

function isImageFile(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function isAudioFile(url: string): boolean {
    return /\.(mp3|wav|ogg|m4a)$/i.test(url);
}

const WallFeed: React.FC<Props> = ({ messages, onMessageUpdate }) => {
    const [localMessages, setLocalMessages] = useState(messages);

    React.useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    const handleLikesChange = (messageId: number, likes: number, isLiked: boolean) => {
        setLocalMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, likes } : msg
        ));
    };

    const handleCommentsCountChange = (messageId: number, count: number) => {
        setLocalMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, commentsCount: count } : msg
        ));
    };

    return (
        <section className="wall-grid" aria-label="Публичные сообщения">
            {localMessages.length === 0 && (
                <div className="empty-state">
                    <h3>На стене пока тихо</h3>
                    <p>Станьте первым, кто оставит теплое сообщение.</p>
                </div>
            )}

            {localMessages.map(message => (
                <article className="wall-card" key={message.id}>
                    <div className="card-topline">
                        <span className="category">{message.category || "love"}</span>
                        {message.city && <span className="city">{message.city}</span>}
                    </div>

                    <div className="message-content">
                        <p className="message-text">{message.text}</p>

                        {message.mediaUrl && (
                            <div className="media-content">
                                {isImageFile(message.mediaUrl) ? (
                                    <img
                                        src={message.mediaUrl}
                                        alt="Прикрепленное изображение"
                                        className="message-image"
                                        loading="lazy"
                                    />
                                ) : isAudioFile(message.mediaUrl) ? (
                                    <audio
                                        controls
                                        className="message-audio"
                                        preload="metadata"
                                    >
                                        <source src={message.mediaUrl} />
                                        Ваш браузер не поддерживает аудио элемент.
                                    </audio>
                                ) : (
                                    <a
                                        className="media-link"
                                        href={message.mediaUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        📎 Медиа-вложение
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="card-actions">
                        <LikeButton
                            messageId={message.id}
                            initialLikes={message.likes || 0}
                            onLikesChange={(likes, isLiked) => handleLikesChange(message.id, likes, isLiked)}
                        />

                        <Comments
                            messageId={message.id}
                            commentsCount={message.commentsCount || 0}
                            onCommentsCountChange={(count) => handleCommentsCountChange(message.id, count)}
                        />
                    </div>

                    <footer className="card-footer">
                        <div className="message-author">
                            {message.userAvatarUrl && (
                                <img
                                    src={message.userAvatarUrl}
                                    alt={message.userName}
                                    className="author-avatar"
                                />
                            )}
                            <span className="author-name">
                                {message.userName || `Пользователь ${message.userId}`}
                            </span>
                        </div>
                        <span className="message-date">{formatDate(message.createdAt)}</span>
                    </footer>
                </article>
            ))}
        </section>
    );
};

export default WallFeed;
