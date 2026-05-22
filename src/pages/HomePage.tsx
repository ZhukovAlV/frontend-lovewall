import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { isLoggedIn } from "../auth";
import "./HomePage.scss";

const HomePage: React.FC = () => {
    const loggedIn = isLoggedIn();

    return (
        <>
            <Header />
            <main className="home-page">
                <section className="hero">
                    <div className="hero-content">
                        <h1>LoveWall</h1>
                        <p className="hero-subtitle">
                            Место, где пары делятся своими историями любви
                        </p>
                        <p className="hero-description">
                            Создайте совместный профиль, делитесь особенными моментами
                            и вдохновляйте других своей историей любви.
                        </p>

                        <div className="hero-actions">
                            {loggedIn ? (
                                <>
                                    <Link to="/couples/create" className="cta-button primary">
                                        💕 Создать пару
                                    </Link>
                                    <Link to="/couples" className="cta-button secondary">
                                        Посмотреть пары
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="cta-button primary">
                                        Присоединиться
                                    </Link>
                                    <Link to="/couples" className="cta-button secondary">
                                        Посмотреть пары
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="love-animation">
                            <div className="heart">💕</div>
                            <div className="heart">💖</div>
                            <div className="heart">💝</div>
                        </div>
                    </div>
                </section>

                <section className="features">
                    <div className="features-content">
                        <h2>Что делает LoveWall особенным?</h2>

                        <div className="features-grid">
                            <div className="feature">
                                <div className="feature-icon">👫</div>
                                <h3>Совместные профили</h3>
                                <p>
                                    Создайте общий профиль пары с фотографиями,
                                    историей отношений и важными датами.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">💌</div>
                                <h3>Стена сообщений</h3>
                                <p>
                                    Делитесь романтическими сообщениями,
                                    фотографиями и особенными моментами.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">🌍</div>
                                <h3>Сообщество пар</h3>
                                <p>
                                    Знакомьтесь с другими парами,
                                    вдохновляйтесь их историями любви.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">🔒</div>
                                <h3>Приватность</h3>
                                <p>
                                    Контролируйте, кто может видеть ваш профиль
                                    и сообщения пары.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="cta-content">
                        <h2>Готовы поделиться своей историей любви?</h2>
                        <p>
                            Присоединяйтесь к тысячам пар, которые уже создали
                            свои профили на LoveWall.
                        </p>

                        <div className="cta-actions">
                            {loggedIn ? (
                                <Link to="/couples/create" className="cta-button large">
                                    Создать пару
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="cta-button large primary">
                                        Создать аккаунт
                                    </Link>
                                    <Link to="/login" className="cta-button large secondary">
                                        Войти
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomePage;
