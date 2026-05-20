import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/userApi";
import { User } from "../models";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Input from "../components/Input";

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        getProfile()
            .then(setUser)
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field: keyof User, value: string) => {
        setUser(current => (current ? { ...current, [field]: value } : current));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setStatus("");
        try {
            const updated = await updateProfile({
                name: user.name,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                city: user.city,
                country: user.country,
                relationshipStatus: user.relationshipStatus,
                privacy: user.privacy
            });
            setUser(updated);
            setStatus("Профиль сохранен.");
        } catch {
            setStatus("Не удалось сохранить профиль.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Header />
            <main className="page profile-page">
                <section className="profile-header">
                    <div className="avatar">{user?.name?.slice(0, 1).toUpperCase() || "L"}</div>
                    <div>
                        <p className="eyebrow">Личный кабинет</p>
                        <h1>{user?.name || "Профиль"}</h1>
                        {user?.email && <p className="muted">{user.email}</p>}
                    </div>
                </section>

                {loading && <Loader />}

                {user && (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <label>
                            Имя
                            <Input value={user.name || ""} onChange={e => handleChange("name", e.target.value)} />
                        </label>
                        <label>
                            Город
                            <Input value={user.city || ""} onChange={e => handleChange("city", e.target.value)} />
                        </label>
                        <label>
                            Страна
                            <Input value={user.country || ""} onChange={e => handleChange("country", e.target.value)} />
                        </label>
                        <label>
                            Статус отношений
                            <Input
                                value={user.relationshipStatus || ""}
                                onChange={e => handleChange("relationshipStatus", e.target.value)}
                            />
                        </label>
                        <label className="wide">
                            Обо мне
                            <textarea value={user.bio || ""} onChange={e => handleChange("bio", e.target.value)} />
                        </label>
                        <label className="wide">
                            Ссылка на аватар
                            <Input
                                value={user.avatarUrl || ""}
                                onChange={e => handleChange("avatarUrl", e.target.value)}
                                placeholder="https://..."
                            />
                        </label>
                        <div className="profile-stats">
                            <span>{user.messagesCount || 0} сообщений</span>
                            <span>{user.likesCount || 0} лайков</span>
                            <span>{user.subscribersCount || 0} подписчиков</span>
                        </div>
                        {status && <div className="notice">{status}</div>}
                        <Button disabled={saving} type="submit">
                            {saving ? "Сохраняем..." : "Сохранить профиль"}
                        </Button>
                    </form>
                )}
            </main>
        </>
    );
};

export default ProfilePage;
