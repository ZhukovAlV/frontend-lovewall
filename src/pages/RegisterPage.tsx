import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { setAuthData } from "../auth";
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const auth = await register(name, email, password);
            setAuthData(auth);
            navigate("/wall");
        } catch {
            setError("Не удалось создать аккаунт. Возможно, email уже занят.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="page auth-page">
                <section className="auth-panel">
                    <p className="eyebrow">Новый аккаунт</p>
                    <h1>Создать профиль</h1>
                    <form className="form-stack" onSubmit={handleSubmit}>
                        <label>
                            Имя
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </label>
                        <label>
                            Email
                            <Input
                                autoComplete="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Пароль
                            <Input
                                autoComplete="new-password"
                                minLength={6}
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        {error && <div className="error">{error}</div>}
                        <Button disabled={loading} type="submit">
                            {loading ? <Loader /> : "Зарегистрироваться"}
                        </Button>
                    </form>
                    <p className="muted">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </p>
                </section>
            </main>
        </>
    );
};

export default RegisterPage;
