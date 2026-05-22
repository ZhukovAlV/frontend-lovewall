import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCoupleRequest } from "../models";
import { createCoupleInvitation } from "../api/coupleApi";
import Button from "./Button";
import "./CreateCouple.scss";

interface CreateCoupleProps {
    onCoupleCreated?: () => void;
}

const CreateCouple: React.FC<CreateCoupleProps> = ({ onCoupleCreated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateCoupleRequest>({
        partnerUserId: 0,
        coupleName: "",
        relationshipStartDate: "",
        anniversaryDate: "",
        bio: "",
        coverPhotoUrl: ""
    });
    const [partnerEmail, setPartnerEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // В реальном приложении здесь нужно сначала найти пользователя по email
            // Пока используем прямой ввод ID
            if (!formData.partnerUserId || formData.partnerUserId <= 0) {
                throw new Error("Укажите корректный ID партнера");
            }

            const couple = await createCoupleInvitation(formData);
            setSuccess(true);

            if (onCoupleCreated) {
                onCoupleCreated();
            }

            // Перенаправляем на страницу пары через 2 секунды
            setTimeout(() => {
                navigate(`/couples/${couple.id}`);
            }, 2000);

        } catch (err: any) {
            console.error("Failed to create couple:", err);
            setError(err.response?.data?.message || err.message || "Ошибка при создании пары");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof CreateCoupleRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (success) {
        return (
            <div className="create-couple-success">
                <div className="success-icon">💕</div>
                <h2>Приглашение отправлено!</h2>
                <p>Ваш партнер получит уведомление о приглашении в пару.</p>
                <p>Перенаправляем на страницу пары...</p>
            </div>
        );
    }

    return (
        <div className="create-couple">
            <div className="create-couple-header">
                <h1>Создать пару</h1>
                <p>Пригласите своего партнера создать совместный профиль</p>
            </div>

            <form onSubmit={handleSubmit} className="create-couple-form">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-section">
                    <h3>Информация о партнере</h3>

                    <div className="form-group">
                        <label htmlFor="partnerEmail">Email партнера</label>
                        <input
                            type="email"
                            id="partnerEmail"
                            value={partnerEmail}
                            onChange={(e) => setPartnerEmail(e.target.value)}
                            placeholder="partner@example.com"
                            required
                        />
                        <small>Мы найдем пользователя по email адресу</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="partnerUserId">ID партнера (временно)</label>
                        <input
                            type="number"
                            id="partnerUserId"
                            value={formData.partnerUserId || ""}
                            onChange={(e) => handleInputChange("partnerUserId", parseInt(e.target.value) || 0)}
                            placeholder="Введите ID пользователя"
                            required
                        />
                        <small>Временное поле для тестирования</small>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Информация о паре</h3>

                    <div className="form-group">
                        <label htmlFor="coupleName">Название пары (необязательно)</label>
                        <input
                            type="text"
                            id="coupleName"
                            value={formData.coupleName}
                            onChange={(e) => handleInputChange("coupleName", e.target.value)}
                            placeholder="Например: Анна и Максим"
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="relationshipStartDate">Дата начала отношений</label>
                        <input
                            type="date"
                            id="relationshipStartDate"
                            value={formData.relationshipStartDate}
                            onChange={(e) => handleInputChange("relationshipStartDate", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="anniversaryDate">Дата годовщины (необязательно)</label>
                        <input
                            type="date"
                            id="anniversaryDate"
                            value={formData.anniversaryDate}
                            onChange={(e) => handleInputChange("anniversaryDate", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Описание пары</label>
                        <textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Расскажите о вашей паре..."
                            rows={4}
                            maxLength={1000}
                        />
                        <small>{formData.bio?.length || 0}/1000 символов</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverPhotoUrl">URL фото пары (необязательно)</label>
                        <input
                            type="url"
                            id="coverPhotoUrl"
                            value={formData.coverPhotoUrl}
                            onChange={(e) => handleInputChange("coverPhotoUrl", e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <Button
                        type="submit"
                        disabled={loading || !formData.partnerUserId}
                        className="create-button"
                    >
                        {loading ? "Отправка приглашения..." : "Отправить приглашение"}
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateCouple;