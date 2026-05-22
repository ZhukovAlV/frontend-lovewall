import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Couple } from "../models";
import { getAllActiveCouples, searchCouples } from "../api/coupleApi";
import { formatDate } from "../utils/dateUtils";
import "./CouplesList.scss";

const CouplesList: React.FC = () => {
    const [couples, setCouples] = useState<Couple[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCouples();
    }, []);

    const loadCouples = async () => {
        setLoading(true);
        setError(null);

        try {
            const couplesData = await getAllActiveCouples();
            setCouples(couplesData);
        } catch (err) {
            console.error("Failed to load couples:", err);
            setError("Ошибка при загрузке пар");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            loadCouples();
            return;
        }

        setSearching(true);
        setError(null);

        try {
            const searchResults = await searchCouples(query.trim());
            setCouples(searchResults);
        } catch (err) {
            console.error("Failed to search couples:", err);
            setError("Ошибка при поиске пар");
        } finally {
            setSearching(false);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Debounce search
        const timeoutId = setTimeout(() => {
            handleSearch(query);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const calculateRelationshipDuration = (startDate: string) => {
        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} дней`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} мес.`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} лет`;
        }
    };

    if (loading) {
        return <div className="couples-list-loading">Загрузка пар...</div>;
    }

    return (
        <div className="couples-list">
            <div className="couples-list-header">
                <h1>Пары LoveWall</h1>
                <p>Познакомьтесь с парами нашего сообщества</p>

                <div className="search-section">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Поиск пар по имени..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            className="search-input"
                        />
                        {searching && <div className="search-spinner">🔍</div>}
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            <div className="couples-grid">
                {couples.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💕</div>
                        <h3>
                            {searchQuery
                                ? "Пары не найдены"
                                : "Пока нет активных пар"
                            }
                        </h3>
                        <p>
                            {searchQuery
                                ? "Попробуйте изменить поисковый запрос"
                                : "Станьте первой парой в нашем сообществе!"
                            }
                        </p>
                    </div>
                ) : (
                    couples.map(couple => (
                        <Link
                            key={couple.id}
                            to={`/couples/${couple.id}`}
                            className="couple-card"
                        >
                            <div className="couple-card-header">
                                {couple.coverPhotoUrl ? (
                                    <div className="couple-cover">
                                        <img src={couple.coverPhotoUrl} alt="Фото пары" />
                                    </div>
                                ) : (
                                    <div className="couple-cover-placeholder">
                                        <span>💕</span>
                                    </div>
                                )}

                                <div className="couple-avatars">
                                    <div className="avatar">
                                        {couple.user1.avatarUrl ? (
                                            <img src={couple.user1.avatarUrl} alt={couple.user1.name} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {couple.user1.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="avatar">
                                        {couple.user2.avatarUrl ? (
                                            <img src={couple.user2.avatarUrl} alt={couple.user2.name} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {couple.user2.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="couple-card-content">
                                <h3 className="couple-name">
                                    {couple.coupleName || `${couple.user1.name} и ${couple.user2.name}`}
                                </h3>

                                {couple.bio && (
                                    <p className="couple-bio">
                                        {couple.bio.length > 100
                                            ? `${couple.bio.substring(0, 100)}...`
                                            : couple.bio
                                        }
                                    </p>
                                )}

                                <div className="couple-meta">
                                    {couple.relationshipStartDate && (
                                        <div className="meta-item">
                                            <span className="meta-label">Вместе:</span>
                                            <span className="meta-value">
                                                {calculateRelationshipDuration(couple.relationshipStartDate)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="couple-stats">
                                        <div className="stat">
                                            <span className="stat-icon">❤️</span>
                                            <span className="stat-value">{couple.likesCount}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-icon">💬</span>
                                            <span className="stat-value">{couple.sharedMessagesCount}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-icon">📸</span>
                                            <span className="stat-value">{couple.sharedPhotosCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="couple-card-footer">
                                    <span className="created-date">
                                        Пара с {formatDate(couple.confirmedAt || couple.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {couples.length > 0 && (
                <div className="couples-list-footer">
                    <p>Показано {couples.length} пар</p>
                </div>
            )}
        </div>
    );
};

export default CouplesList;