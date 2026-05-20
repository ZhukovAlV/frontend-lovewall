import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import WallPage from "./pages/WallPage";
import { isLoggedIn } from "./auth";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wall" element={<WallPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<Navigate to="/wall" replace />} />
        </Routes>
    </BrowserRouter>
);

export default App;
