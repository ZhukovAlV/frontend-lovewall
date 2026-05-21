import http from "../http";
import { User } from "../models";

export interface SearchUsersResponse {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// User profile management
export async function getProfile(): Promise<User> {
    const { data } = await http.get("/api/users/me");
    return data;
}

export async function getCurrentUser(): Promise<User> {
    const { data } = await http.get("/api/users/me");
    return data;
}

export async function getUserById(id: number): Promise<User> {
    const { data } = await http.get(`/api/users/${id}`);
    return data;
}

export async function updateProfile(user: Partial<User>): Promise<User> {
    const { data } = await http.put("/api/users/me", user);
    return data;
}

export async function updateCurrentUser(user: Partial<User>): Promise<User> {
    const { data } = await http.put("/api/users/me", user);
    return data;
}

// User search and discovery
export async function searchUsers(query?: string, page: number = 0, size: number = 20): Promise<SearchUsersResponse> {
    const { data } = await http.get("/api/users/search", {
        params: { query, page, size }
    });
    return data;
}

// Following system
export async function followUser(userId: number): Promise<{ success: boolean; isFollowing: boolean }> {
    const { data } = await http.post(`/api/users/${userId}/follow`);
    return data;
}

export async function unfollowUser(userId: number): Promise<{ success: boolean; isFollowing: boolean }> {
    const { data } = await http.delete(`/api/users/${userId}/follow`);
    return data;
}

export async function getFollowers(userId: number, page: number = 0, size: number = 20): Promise<User[]> {
    const { data } = await http.get(`/api/users/${userId}/followers`, {
        params: { page, size }
    });
    return data;
}

export async function getFollowing(userId: number, page: number = 0, size: number = 20): Promise<User[]> {
    const { data } = await http.get(`/api/users/${userId}/following`, {
        params: { page, size }
    });
    return data;
}

export async function getFollowStatus(userId: number): Promise<{ isFollowing: boolean }> {
    const { data } = await http.get(`/api/users/${userId}/follow-status`);
    return data;
}
