import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { setAuthData } from "../auth";
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";

const LoginPage: React.FC = () => {
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
            const auth = await login(email, password);
            setAuthData(auth);
            navigate("/wall");
        } catch {
            setError("Не удалось войти. Проверьте email и пароль.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="page auth-page">
                <section className="auth-panel">
                    <p className="eyebrow">Добро пожаловать</p>
                    <h1>Вход в LoveWall</h1>
                    <form className="form-stack" onSubmit={handleSubmit}>
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
                                autoComplete="current-password"
                                minLength={6}
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        {error && <div className="error">{error}</div>}
                        <Button disabled={loading} type="submit">
                            {loading ? <Loader /> : "Войти"}
                        </Button>
                    </form>
                    <p className="muted">
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </p>
                </section>
            </main>
        </>
    );
};

export default LoginPage;
