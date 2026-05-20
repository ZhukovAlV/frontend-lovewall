import React from "react";
import { WallMessage } from "../models";

type Props = {
    messages: WallMessage[];
    onLike: (id: number) => void;
    likingId?: number | null;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

const WallFeed: React.FC<Props> = ({ messages, onLike, likingId }) => (
    <section className="wall-grid" aria-label="Публичные сообщения">
        {messages.length === 0 && (
            <div className="empty-state">
                <h3>На стене пока тихо</h3>
                <p>Станьте первым, кто оставит теплое сообщение.</p>
            </div>
        )}

        {messages.map(message => (
            <article className="wall-card" key={message.id}>
                <div className="card-topline">
                    <span className="category">{message.category || "love"}</span>
                    {message.city && <span>{message.city}</span>}
                </div>
                <p className="message-text">{message.text}</p>
                {message.mediaUrl && (
                    <a className="media-link" href={message.mediaUrl} target="_blank" rel="noreferrer">
                        Медиа-вложение
                    </a>
                )}
                <footer className="card-footer">
                    <span>#{message.id} от пользователя {message.userId}</span>
                    <span>{formatDate(message.createdAt)}</span>
                </footer>
                <button
                    className="like-button"
                    disabled={likingId === message.id}
                    onClick={() => onLike(message.id)}
                    type="button"
                >
                    ♥ {message.likes || 0}
                </button>
            </article>
        ))}
    </section>
);

export default WallFeed;
