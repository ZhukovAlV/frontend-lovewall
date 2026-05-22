import React from "react";
import { Link, NavLink } from "react-router-dom";
import { getUserName, isLoggedIn, logout } from "../auth";

const Header: React.FC = () => {
    const loggedIn = isLoggedIn();
    const userName = getUserName();

    return (
        <header className="app-header">
            <Link className="brand" to="/wall" aria-label="LoveWall">
                <span className="brand-mark">LW</span>
                <span>
                    <strong>LoveWall</strong>
                    <small>lovewall.art</small>
                </span>
            </Link>

            <nav className="nav">
                <NavLink to="/wall">Стена</NavLink>
                {loggedIn && <NavLink to="/couples">💕 Пары</NavLink>}
                {loggedIn && <NavLink to="/profile">Профиль</NavLink>}
                {loggedIn ? (
                    <>
                        <span className="user-chip">{userName || "Аккаунт"}</span>
                        <button className="ghost-button" onClick={logout} type="button">
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Войти</NavLink>
                        <Link className="primary-link" to="/register">
                            Создать аккаунт
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
