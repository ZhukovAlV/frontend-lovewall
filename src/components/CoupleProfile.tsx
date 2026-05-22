import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Couple, UpdateCoupleRequest, CouplePrivacy } from "../models";
import { getCoupleById, updateCouple, endCouple } from "../api/coupleApi";
import { getCurrentUserId, isLoggedIn } from "../auth";
import { formatDate } from "../utils/dateUtils";
import Button from "./Button";
import "./CoupleProfile.scss";

const CoupleProfile: React.FC = () => {
    const { coupleId } = useParams<{ coupleId: string }>();
    const navigate = useNavigate();
    const [couple, setCouple] = useState<Couple | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState<UpdateCoupleRequest>({});
    const [error, setError] = useState<string | null>(null);

    const currentUserId = getCurrentUserId();
    const loggedIn = isLoggedIn();

    useEffect(() => {
        loadCouple();
    }, [coupleId]);

    const loadCouple = async () => {
        if (!coupleId) return;

        setLoading(true);
        setError(null);

        try {
            const coupleData = await getCoupleById(parseInt(coupleId));
            if (coupleData) {
                setCouple(coupleData);
                setEditForm({
                    coupleName: coupleData.coupleName || "",
                    relationshipStartDate: coupleData.relationshipStartDate || "",
                    anniversaryDate: coupleData.anniversaryDate || "",
                    bio: coupleData.bio || "",
                    coverPhotoUrl: coupleData.coverPhotoUrl || "",
                    privacy: coupleData.privacy
                });
            } else {
                setError("Пара не найдена");
            }
        } catch (err) {
            console.error("Failed to load couple:", err);
            setError("Ошибка при загрузке профиля пары");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!couple || !currentUserId) return;

        try {
            const updatedCouple = await updateCouple(couple.id, editForm);
            setCouple(updatedCouple);
            setEditing(false);
        } catch (err) {
            console.error("Failed to update couple:", err);
            setError("Ошибка при обновлении профиля пары");
        }
    };

    const handleEndCouple = async () => {
        if (!couple || !currentUserId) return;

        const confirmed = window.confirm(
            "Вы уверены, что хотите завершить отношения? Это действие нельзя отменить."
        );

        if (confirmed) {
            try {
                await endCouple(couple.id);
                navigate("/couples");
            } catch (err) {
                console.error("Failed to end couple:", err);
                setError("Ошибка при завершении отношений");
            }
        }
    };

    const isUserInCouple = () => {
        return couple && currentUserId && (
            couple.user1.id === currentUserId || couple.user2.id === currentUserId
        );
    };

    const getPartner = () => {
        if (!couple || !currentUserId) return null;
        return couple.user1.id === currentUserId ? couple.user2 : couple.user1;
    };

    const calculateRelationshipDuration = () => {
        if (!couple?.relationshipStartDate) return null;

        const startDate = new Date(couple.relationshipStartDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} дней`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} месяцев`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return `${years} лет ${remainingMonths > 0 ? `${remainingMonths} месяцев` : ''}`;
        }
    };

    if (loading) {
        return <div className="couple-profile-loading">Загрузка профиля пары...</div>;
    }

    if (error) {
        return <div className="couple-profile-error">{error}</div>;
    }

    if (!couple) {
        return <div className="couple-profile-not-found">Пара не найдена</div>;
    }

    const partner = getPartner();
    const canEdit = isUserInCouple() && couple.isActive;
    const relationshipDuration = calculateRelationshipDuration();

    return (
        <div className="couple-profile">
            <div className="couple-header">
                {couple.coverPhotoUrl && (
                    <div className="couple-cover">
                        <img src={couple.coverPhotoUrl} alt="Фото пары" />
                    </div>
                )}

                <div className="couple-info">
                    <div className="couple-avatars">
                        <div className="avatar-container">
                            {couple.user1.avatarUrl && (
                                <img src={couple.user1.avatarUrl} alt={couple.user1.name} />
                            )}
                            <span className="user-name">{couple.user1.name}</span>
                        </div>
                        <div className="heart-separator">💕</div>
                        <div className="avatar-container">
                            {couple.user2.avatarUrl && (
                                <img src={couple.user2.avatarUrl} alt={couple.user2.name} />
                            )}
                            <span className="user-name">{couple.user2.name}</span>
                        </div>
                    </div>

                    {editing ? (
                        <div className="edit-form">
                            <input
                                type="text"
                                placeholder="Название пары"
                                value={editForm.coupleName || ""}
                                onChange={(e) => setEditForm({...editForm, coupleName: e.target.value})}
                            />
                        </div>
                    ) : (
                        <h1 className="couple-name">
                            {couple.coupleName || `${couple.user1.name} и ${couple.user2.name}`}
                        </h1>
                    )}

                    <div className="couple-stats">
                        <div className="stat">
                            <span className="stat-value">{couple.likesCount}</span>
                            <span className="stat-label">лайков</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{couple.sharedMessagesCount}</span>
                            <span className="stat-label">сообщений</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{couple.sharedPhotosCount}</span>
                            <span className="stat-label">фото</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="couple-content">
                <div className="couple-details">
                    {couple.relationshipStartDate && (
                        <div className="detail-item">
                            <span className="detail-label">Вместе с:</span>
                            <span className="detail-value">
                                {formatDate(couple.relationshipStartDate)}
                                {relationshipDuration && ` (${relationshipDuration})`}
                            </span>
                        </div>
                    )}

                    {couple.anniversaryDate && (
                        <div className="detail-item">
                            <span className="detail-label">Годовщина:</span>
                            <span className="detail-value">{formatDate(couple.anniversaryDate)}</span>
                        </div>
                    )}

                    <div className="detail-item">
                        <span className="detail-label">Статус:</span>
                        <span className={`detail-value status-${couple.status.toLowerCase()}`}>
                            {couple.status === 'ACTIVE' ? 'Активная пара' :
                             couple.status === 'PENDING' ? 'Ожидает подтверждения' :
                             couple.status === 'PAUSED' ? 'Приостановлена' : 'Завершена'}
                        </span>
                    </div>
                </div>

                <div className="couple-bio">
                    {editing ? (
                        <textarea
                            placeholder="Расскажите о вашей паре..."
                            value={editForm.bio || ""}
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                            rows={4}
                        />
                    ) : (
                        <p>{couple.bio || "Пара пока не добавила описание"}</p>
                    )}
                </div>

                {canEdit && (
                    <div className="couple-actions">
                        {editing ? (
                            <div className="edit-actions">
                                <Button onClick={handleSaveChanges}>Сохранить</Button>
                                <Button variant="secondary" onClick={() => setEditing(false)}>
                                    Отмена
                                </Button>
                            </div>
                        ) : (
                            <div className="profile-actions">
                                <Button onClick={() => setEditing(true)}>
                                    Редактировать профиль
                                </Button>
                                <Button variant="danger" onClick={handleEndCouple}>
                                    Завершить отношения
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {couple.isPending && isUserInCouple() && (
                    <div className="pending-notice">
                        <p>
                            {couple.createdByUserId === currentUserId
                                ? `Ожидается подтверждение от ${partner?.name}`
                                : `${couple.user1.name} пригласил вас в пару`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoupleProfile;