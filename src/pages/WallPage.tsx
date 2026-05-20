import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createMessage, fetchWall, likeMessage } from "../api/wallApi";
import { WallFilters, WallMessage } from "../models";
import { isLoggedIn } from "../auth";
import Header from "../components/Header";
import WallFeed from "../components/WallFeed";
import Loader from "../components/Loader";
import Button from "../components/Button";

const categories = [
    { value: "", label: "Все категории" },
    { value: "love", label: "Любимый человек" },
    { value: "family", label: "Семья" },
    { value: "friends", label: "Друзья" },
    { value: "gratitude", label: "Благодарность" }
];

const WallPage: React.FC = () => {
    const [messages, setMessages] = useState<WallMessage[]>([]);
    const [filters, setFilters] = useState<WallFilters>({});
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [likingId, setLikingId] = useState<number | null>(null);
    const [text, setText] = useState("");
    const [category, setCategory] = useState("love");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");

    const loggedIn = isLoggedIn();

    const loadMessages = async (nextFilters = filters) => {
        setLoading(true);
        setError("");
        try {
            setMessages(await fetchWall(nextFilters));
        } catch {
            setError("Не удалось загрузить стену. Проверьте, что backend запущен.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loadMessages(filters);
    };

    const resetFilters = () => {
        const emptyFilters: WallFilters = {};
        setFilters(emptyFilters);
        loadMessages(emptyFilters);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setPublishing(true);
        setError("");
        try {
            await createMessage({
                text: text.trim(),
                category,
                city: city.trim() || undefined,
                isPublic: true
            });
            setText("");
            await loadMessages(filters);
        } catch {
            setError("Не удалось опубликовать сообщение.");
        } finally {
            setPublishing(false);
        }
    };

    const handleLike = async (id: number) => {
        setLikingId(id);
        try {
            const updated = await likeMessage(id);
            setMessages(current => current.map(message => (message.id === id ? updated : message)));
        } finally {
            setLikingId(null);
        }
    };

    useEffect(() => {
        loadMessages({});
    }, []);

    return (
        <>
            <Header />
            <main className="page wall-page">
                <section className="wall-hero">
                    <div>
                        <p className="eyebrow">Публичная стена</p>
                        <h1>LoveWall</h1>
                        <p className="hero-copy">
                            Место для коротких признаний, благодарностей и теплых сообщений, которые хочется оставить
                            на виду.
                        </p>
                    </div>
                    <div className="pulse-panel" aria-label="Активность стены">
                        <span className="pulse-heart">♥</span>
                        <strong>{messages.length}</strong>
                        <small>сообщений в подборке</small>
                    </div>
                </section>

                <section className="toolbar">
                    <form className="filters" onSubmit={handleFilterSubmit}>
                        <input
                            value={filters.query || ""}
                            onChange={e => setFilters({ ...filters, query: e.target.value || undefined })}
                            placeholder="Поиск по тексту"
                            type="search"
                        />
                        <input
                            value={filters.city || ""}
                            onChange={e => setFilters({ ...filters, city: e.target.value || undefined })}
                            placeholder="Город"
                        />
                        <select
                            value={filters.category || ""}
                            onChange={e => setFilters({ ...filters, category: e.target.value || undefined })}
                        >
                            {categories.map(item => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        <Button type="submit">Применить</Button>
                        <button className="ghost-button" onClick={resetFilters} type="button">
                            Сбросить
                        </button>
                    </form>
                </section>

                <section className="composer-row">
                    {loggedIn ? (
                        <form className="composer" onSubmit={handleSubmit}>
                            <textarea
                                maxLength={1024}
                                onChange={e => setText(e.target.value)}
                                placeholder="Напишите сообщение для стены"
                                required
                                value={text}
                            />
                            <div className="composer-controls">
                                <select value={category} onChange={e => setCategory(e.target.value)}>
                                    {categories.slice(1).map(item => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Город" />
                                <Button disabled={publishing} type="submit">
                                    {publishing ? "Публикуем..." : "Опубликовать"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="join-panel">
                            <strong>Хотите оставить сообщение?</strong>
                            <span>Создайте аккаунт, чтобы опубликовать признание на стене.</span>
                            <Link className="primary-link" to="/register">
                                Создать аккаунт
                            </Link>
                        </div>
                    )}
                </section>

                {error && <div className="error">{error}</div>}
                {loading ? <Loader /> : <WallFeed messages={messages} onLike={handleLike} likingId={likingId} />}
            </main>
        </>
    );
};

export default WallPage;
