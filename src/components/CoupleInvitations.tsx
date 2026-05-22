import React, { useState, useEffect } from "react";
import { Couple } from "../models";
import { getPendingInvitations, getSentInvitations, acceptCoupleInvitation, rejectCoupleInvitation } from "../api/coupleApi";
import { formatDate } from "../utils/dateUtils";
import Button from "./Button";
import "./CoupleInvitations.scss";

const CoupleInvitations: React.FC = () => {
    const [pendingInvitations, setPendingInvitations] = useState<Couple[]>([]);
    const [sentInvitations, setSentInvitations] = useState<Couple[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        setLoading(true);
        setError(null);

        try {
            const [pending, sent] = await Promise.all([
                getPendingInvitations(),
                getSentInvitations()
            ]);

            setPendingInvitations(pending);
            setSentInvitations(sent);
        } catch (err) {
            console.error("Failed to load invitations:", err);
            setError("Ошибка при загрузке приглашений");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptInvitation = async (coupleId: number) => {
        setProcessingId(coupleId);

        try {
            await acceptCoupleInvitation(coupleId);
            // Обновляем список приглашений
            await loadInvitations();
        } catch (err) {
            console.error("Failed to accept invitation:", err);
            setError("Ошибка при принятии приглашения");
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectInvitation = async (coupleId: number) => {
        setProcessingId(coupleId);

        try {
            await rejectCoupleInvitation(coupleId);
            // Обновляем список приглашений
            await loadInvitations();
        } catch (err) {
            console.error("Failed to reject invitation:", err);
            setError("Ошибка при отклонении приглашения");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <div className="invitations-loading">Загрузка приглашений...</div>;
    }

    return (
        <div className="couple-invitations">
            <div className="invitations-header">
                <h1>Приглашения в пары</h1>
                <p>Управляйте входящими и исходящими приглашениями</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            <div className="invitations-content">
                {/* Входящие приглашения */}
                <section className="invitations-section">
                    <h2>Входящие приглашения ({pendingInvitations.length})</h2>

                    {pendingInvitations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💌</div>
                            <p>У вас нет входящих приглашений</p>
                        </div>
                    ) : (
                        <div className="invitations-list">
                            {pendingInvitations.map(couple => (
                                <div key={couple.id} className="invitation-card">
                                    <div className="invitation-info">
                                        <div className="invitation-users">
                                            <div className="user-avatar">
                                                {couple.user1.avatarUrl && (
                                                    <img src={couple.user1.avatarUrl} alt={couple.user1.name} />
                                                )}
                                            </div>
                                            <div className="invitation-details">
                                                <h3>{couple.user1.name} пригласил вас в пару</h3>
                                                {couple.coupleName && (
                                                    <p className="couple-name">"{couple.coupleName}"</p>
                                                )}
                                                {couple.bio && (
                                                    <p className="couple-bio">{couple.bio}</p>
                                                )}
                                                <div className="invitation-meta">
                                                    <span>Отправлено: {formatDate(couple.createdAt)}</span>
                                                    {couple.relationshipStartDate && (
                                                        <span>Вместе с: {formatDate(couple.relationshipStartDate)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="invitation-actions">
                                        <Button
                                            onClick={() => handleAcceptInvitation(couple.id)}
                                            disabled={processingId === couple.id}
                                            className="accept-button"
                                        >
                                            {processingId === couple.id ? "Принятие..." : "Принять"}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleRejectInvitation(couple.id)}
                                            disabled={processingId === couple.id}
                                        >
                                            {processingId === couple.id ? "Отклонение..." : "Отклонить"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Отправленные приглашения */}
                <section className="invitations-section">
                    <h2>Отправленные приглашения ({sentInvitations.length})</h2>

                    {sentInvitations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📤</div>
                            <p>Вы не отправляли приглашений</p>
                        </div>
                    ) : (
                        <div className="invitations-list">
                            {sentInvitations.map(couple => (
                                <div key={couple.id} className="invitation-card sent">
                                    <div className="invitation-info">
                                        <div className="invitation-users">
                                            <div className="user-avatar">
                                                {couple.user2.avatarUrl && (
                                                    <img src={couple.user2.avatarUrl} alt={couple.user2.name} />
                                                )}
                                            </div>
                                            <div className="invitation-details">
                                                <h3>Приглашение для {couple.user2.name}</h3>
                                                {couple.coupleName && (
                                                    <p className="couple-name">"{couple.coupleName}"</p>
                                                )}
                                                {couple.bio && (
                                                    <p className="couple-bio">{couple.bio}</p>
                                                )}
                                                <div className="invitation-meta">
                                                    <span>Отправлено: {formatDate(couple.createdAt)}</span>
                                                    <span className="status-pending">Ожидает ответа</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="invitation-actions">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleRejectInvitation(couple.id)}
                                            disabled={processingId === couple.id}
                                        >
                                            {processingId === couple.id ? "Отмена..." : "Отменить"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CoupleInvitations;