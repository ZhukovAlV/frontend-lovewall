import axios from "axios";
import { User } from "../models";

const getUserServiceURL = () => {
    return import.meta.env.VITE_API_USER_SERVICE_URL || "http://localhost:8081";
};

const api = axios.create({
    baseURL: getUserServiceURL(),
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

export interface SearchUsersResponse {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export async function getProfile(): Promise<User> {
    const { data } = await api.get("/api/users/me");
    return data;
}

export async function getCurrentUser(): Promise<User> {
    const { data } = await api.get("/api/users/me");
    return data;
}

export async function getUserById(id: number): Promise<User> {
    const { data } = await api.get(`/api/users/${id}`);
    return data;
}

export async function updateProfile(user: Partial<User>): Promise<User> {
    const { data } = await api.put("/api/users/me", user);
    return data;
}

export async function updateCurrentUser(user: Partial<User>): Promise<User> {
    const { data } = await api.put("/api/users/me", user);
    return data;
}

export async function searchUsers(query?: string, page: number = 0, size: number = 20): Promise<SearchUsersResponse> {
    const { data } = await api.get("/api/users/search/users", {
        params: { query, page, size }
    });
    return data;
}

export async function followUser(userId: number): Promise<{ success: boolean; isFollowing: boolean }> {
    const { data } = await api.post(`/api/users/${userId}/follow`);
    return data;
}

export async function unfollowUser(userId: number): Promise<{ success: boolean; isFollowing: boolean }> {
    const { data } = await api.delete(`/api/users/${userId}/follow`);
    return data;
}

export async function getFollowers(userId: number, page: number = 0, size: number = 20): Promise<User[]> {
    const { data } = await api.get(`/api/users/${userId}/followers`, {
        params: { page, size }
    });
    return data;
}

export async function getFollowing(userId: number, page: number = 0, size: number = 20): Promise<User[]> {
    const { data } = await api.get(`/api/users/${userId}/following`, {
        params: { page, size }
    });
    return data;
}

export async function getFollowStatus(userId: number): Promise<{ isFollowing: boolean }> {
    const { data } = await api.get(`/api/users/${userId}/follow-status`);
    return data;
}
