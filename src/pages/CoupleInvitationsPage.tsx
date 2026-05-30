import React from "react";
import { Link } from "react-router-dom";
import CoupleInvitations from "../components/CoupleInvitations";
import "./CoupleInvitationsPage.scss";

const CoupleInvitationsPage: React.FC = () => {
    return (
        <div className="couple-invitations-page">
            <div className="page-header">
                <div className="header-content">
                    <Link to="/couples" className="back-link">
                        ← Все пары
                    </Link>
                    <Link to="/couples/create" className="create-link">
                        💕 Создать пару
                    </Link>
                </div>
            </div>

            <div className="page-content">
                <CoupleInvitations />
            </div>

            <div className="page-tips">
                <div className="tips-content">
                    <h3>💡 Полезные советы</h3>
                    <div className="tips-list">
                        <div className="tip">
                            <span className="tip-icon">📨</span>
                            <p>Приглашения действительны неограниченное время</p>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🔔</span>
                            <p>Ваш партнер получит уведомление о приглашении</p>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">✨</span>
                            <p>После принятия приглашения вы сможете создать совместный профиль</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoupleInvitationsPage;