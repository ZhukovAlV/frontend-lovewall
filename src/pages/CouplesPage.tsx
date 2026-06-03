import React from "react";
import { Link } from "react-router-dom";
import CouplesList from "../components/CouplesList";
import { isLoggedIn } from "../auth";
import "./CouplesPage.scss";

const CouplesPage: React.FC = () => {
    const loggedIn = isLoggedIn();

    return (
        <div className="couples-page">
            <div className="couples-page-header">
                <div className="header-content">
                    <div className="header-text">
                        <Link to="/">
                            <h1>Пары LoveWall</h1>
                        </Link>
                        <p>Откройте для себя истории любви нашего сообщества</p>
                    </div>

                    {loggedIn && (
                        <div className="header-actions">
                            <Link to="/couples/create" className="create-couple-btn">
                                💕 Создать пару
                            </Link>
                            <Link to="/couples/invitations" className="invitations-btn">
                                📨 Приглашения
                            </Link>
                        </div>
                    )}
                </div>

                {!loggedIn && (
                    <div className="auth-prompt">
                        <p>
                            <Link to="/login">Войдите</Link> или{" "}
                            <Link to="/register">зарегистрируйтесь</Link>, чтобы создать свою пару
                        </p>
                    </div>
                )}
            </div>

            <CouplesList />

            <div className="couples-page-footer">
                <div className="footer-content">
                    <h3>Создайте свою историю любви</h3>
                    <p>
                        Присоединяйтесь к сообществу пар LoveWall и делитесь своими
                        особенными моментами с миром.
                    </p>
                    {loggedIn ? (
                        <Link to="/couples/create" className="cta-button">
                            Создать пару
                        </Link>
                    ) : (
                        <Link to="/register" className="cta-button">
                            Присоединиться
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouplesPage;