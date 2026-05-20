import { AuthData } from "./models";

export function setAuthToken(token: string) {
    localStorage.setItem("token", token);
}

export function setAuthData(auth: AuthData) {
    localStorage.setItem("token", auth.token);
    localStorage.setItem("userName", auth.name);
    localStorage.setItem("userEmail", auth.email);
    localStorage.setItem("userId", String(auth.userId));
}

export function getAuthToken(): string | null {
    return localStorage.getItem("token");
}

export function getUserName(): string | null {
    return localStorage.getItem("userName");
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    window.location.href = "/login";
}

export function isLoggedIn(): boolean {
    return !!getAuthToken();
}
