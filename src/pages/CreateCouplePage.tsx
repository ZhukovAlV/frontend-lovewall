import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateCouple from "../components/CreateCouple";
import "./CreateCouplePage.scss";

const CreateCouplePage: React.FC = () => {
    const navigate = useNavigate();

    const handleCoupleCreated = () => {
        // Компонент CreateCouple сам перенаправит на страницу пары
        // Здесь можно добавить дополнительную логику если нужно
    };

    return (
        <div className="create-couple-page">
            <div className="page-header">
                <div className="header-content">
                    <Link to="/couples" className="back-link">
                        ← Назад к парам
                    </Link>
                </div>
            </div>

            <div className="page-content">
                <CreateCouple onCoupleCreated={handleCoupleCreated} />
            </div>

            <div className="page-info">
                <div className="info-content">
                    <h3>Как это работает?</h3>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-text">
                                <h4>Отправьте приглашение</h4>
                                <p>Укажите данные вашего партнера и информацию о паре</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-text">
                                <h4>Дождитесь подтверждения</h4>
                                <p>Ваш партнер получит уведомление и сможет принять приглашение</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-text">
                                <h4>Создайте совместный профиль</h4>
                                <p>Делитесь своей историей любви с сообществом</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCouplePage;