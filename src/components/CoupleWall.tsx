import React, { useEffect, useState } from "react";
import { WallMessage } from "../models";
import { fetchCoupleWall, createCoupleMessage } from "../api/wallApi";
import { getCurrentUserId } from "../auth";
import { formatDate } from "../utils/dateUtils";
import Button from "./Button";
import "./CoupleWall.scss";

interface CoupleWallProps {
    coupleId: number;
    /** Имена участников для подписи сообщений (необязательно) */
    members?: Record<number, string>;
}

const CoupleWall: React.FC<CoupleWallProps> = ({ coupleId, members }) => {
    const [messages, setMessages] = useState<WallMessage[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentUserId = getCurrentUserId();

    useEffect(() => {
        loadMessages();
    }, [coupleId]);

    const loadMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCoupleWall(coupleId);
            setMessages(data);
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError("Эти сообщения доступны только участникам пары.");
            } else {
                setError("Не удалось загрузить сообщения пары.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        setSubmitting(true);
        setError(null);
        try {
            const created = await createCoupleMessage(coupleId, {
                text: trimmed,
                category: "couple",
            });
            setMessages((prev) => [created, ...prev]);
            setText("");
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError("Только участники пары могут оставлять сообщения.");
            } else {
                setError("Не удалось отправить сообщение.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const authorName = (msg: WallMessage): string => {
        if (msg.userName) return msg.userName;
        if (members && msg.userId in members) return members[msg.userId];
        return msg.userId === currentUserId ? "Вы" : "Партнёр";
    };

    return (
        <div className="couple-wall">
            <div className="couple-wall__header">
                <h2>💌 Наша стена</h2>
                <p className="couple-wall__hint">
                    Эти сообщения видят только двое из вашей пары.
                </p>
            </div>

            <form className="couple-wall__composer" onSubmit={handleSubmit}>
                <textarea
                    placeholder="Напишите что-нибудь для вашей половинки..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    maxLength={1024}
                    disabled={submitting}
                />
                <div className="couple-wall__composer-actions">
                    <Button type="submit" disabled={submitting || !text.trim()}>
                        {submitting ? "Отправка..." : "Оставить сообщение"}
                    </Button>
                </div>
            </form>

            {error && <div className="couple-wall__error">{error}</div>}

            {loading ? (
                <div className="couple-wall__loading">Загрузка сообщений...</div>
            ) : messages.length === 0 ? (
                <div className="couple-wall__empty">
                    Пока нет сообщений. Станьте первым, кто оставит тёплые слова 💕
                </div>
            ) : (
                <ul className="couple-wall__list">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className={`couple-wall__item ${
                                msg.userId === currentUserId ? "is-own" : ""
                            }`}
                        >
                            <div className="couple-wall__item-meta">
                                <span className="couple-wall__author">{authorName(msg)}</span>
                                <span className="couple-wall__date">
                                    {formatDate(msg.createdAt)}
                                </span>
                            </div>
                            <p className="couple-wall__text">{msg.text}</p>
                            {msg.mediaUrl && (
                                <img
                                    className="couple-wall__media"
                                    src={msg.mediaUrl}
                                    alt="Вложение"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CoupleWall;
