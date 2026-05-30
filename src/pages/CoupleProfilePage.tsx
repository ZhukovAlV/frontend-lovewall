import React from "react";
import { Link } from "react-router-dom";
import CoupleProfile from "../components/CoupleProfile";
import "./CoupleProfilePage.scss";

const CoupleProfilePage: React.FC = () => {
    return (
        <div className="couple-profile-page">
            <div className="page-header">
                <div className="header-content">
                    <Link to="/couples" className="back-link">
                        ← Все пары
                    </Link>
                </div>
            </div>

            <div className="page-content">
                <CoupleProfile />
            </div>
        </div>
    );
};

export default CoupleProfilePage;