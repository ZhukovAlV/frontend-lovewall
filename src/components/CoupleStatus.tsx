import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Couple } from "../models";
import { getMyActiveCouple, getPendingInvitations } from "../api/coupleApi";
import { formatDate } from "../utils/dateUtils";
import "./CoupleStatus.scss";

const CoupleStatus: React.FC = () => {
    const [activeCouple, setActiveCouple] = useState<Couple | null>(null);
    const [pendingInvitations, setPendingInvitations] = useState<Couple[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCoupleData();
    }, []);

    const loadCoupleData = async () => {
        setLoading(true);
        try {
            const [couple, invitations] = await Promise.all([
                getMyActiveCouple(),
                getPendingInvitations()
            ]);

            setActiveCouple(couple);
            setPendingInvitations(invitations);
        } catch (error) {
            console.error("Failed to load couple data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="couple-status loading">
                <div className="status-header">
                    <h3>💕 Статус пары</h3>
                </div>
                <p>Загрузка...</p>
            </div>
        );
    }

    // Если есть активная пара
    if (activeCouple) {
        const partner = activeCouple.user1.id !== parseInt(localStorage.getItem('userId') || '0')
            ? activeCouple.user1
            : activeCouple.user2;

        return (
            <div className="couple-status active">
                <div className="status-header">
                    <h3>💕 Ваша пара</h3>
                    <Link to={`/couples/${activeCouple.id}`} className="view-profile-link">
                        Посмотреть профиль
                    </Link>
                </div>

                <div className="couple-info">
                    <div className="couple-avatars">
                        <div className="partner-avatar">
                            {partner.avatarUrl ? (
                                <img src={partner.avatarUrl} alt={partner.name} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {partner.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="heart">💕</div>
                    </div>

                    <div className="couple-details">
                        <h4>{activeCouple.coupleName || `Вы и ${partner.name}`}</h4>
                        {activeCouple.relationshipStartDate && (
                            <p className="relationship-date">
                                Вместе с {formatDate(activeCouple.relationshipStartDate)}
                            </p>
                        )}

                        <div className="couple-stats">
                            <span>❤️ {activeCouple.likesCount}</span>
                            <span>💬 {activeCouple.sharedMessagesCount}</span>
                            <span>📸 {activeCouple.sharedPhotosCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Если есть входящие приглашения
    if (pendingInvitations.length > 0) {
        return (
            <div className="couple-status pending">
                <div className="status-header">
                    <h3>💌 Приглашения в пары</h3>
                    <Link to="/couples/invitations" className="manage-invitations-link">
                        Управление ({pendingInvitations.length})
                    </Link>
                </div>

                <div className="invitations-preview">
                    {pendingInvitations.slice(0, 2).map(invitation => (
                        <div key={invitation.id} className="invitation-preview">
                            <div className="invitation-avatar">
                                {invitation.user1.avatarUrl ? (
                                    <img src={invitation.user1.avatarUrl} alt={invitation.user1.name} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {invitation.user1.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="invitation-info">
                                <p><strong>{invitation.user1.name}</strong> пригласил вас в пару</p>
                                {invitation.coupleName && (
                                    <p className="couple-name">"{invitation.coupleName}"</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {pendingInvitations.length > 2 && (
                        <p className="more-invitations">
                            И еще {pendingInvitations.length - 2} приглашений...
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Если нет пары и приглашений
    return (
        <div className="couple-status empty">
            <div className="status-header">
                <h3>💕 Создайте пару</h3>
            </div>

            <div className="empty-state">
                <p>У вас пока нет пары. Пригласите своего партнера создать совместный профиль!</p>

                <div className="couple-actions">
                    <Link to="/couples/create" className="create-couple-btn">
                        Создать пару
                    </Link>
                    <Link to="/couples" className="browse-couples-btn">
                        Посмотреть пары
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CoupleStatus;