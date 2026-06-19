import axios from "axios";
import { CreateWallMessage, WallFilters, WallMessage, Comment, CreateCommentRequest } from "../models";

const getWallServiceURL = () => {
    return import.meta.env.VITE_API_WALL_SERVICE_URL || "http://localhost:8082";
};

const api = axios.create({
    baseURL: getWallServiceURL(),
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

export async function fetchWall(filters: WallFilters = {}): Promise<WallMessage[]> {
    const { data } = await api.get("/api/wall/public", { params: filters });
    return data;
}

export async function createMessage(payload: CreateWallMessage): Promise<WallMessage> {
    const { data } = await api.post("/api/wall", payload);
    return data;
}

export async function updateMessage(id: number, payload: CreateWallMessage): Promise<WallMessage> {
    const { data } = await api.put(`/api/wall/${id}`, payload);
    return data;
}

export async function deleteMessage(id: number): Promise<void> {
    await api.delete(`/api/wall/${id}`);
}

export async function fetchCoupleWall(coupleId: number): Promise<WallMessage[]> {
    const { data } = await api.get(`/api/wall/couple/${coupleId}`);
    return data;
}

export async function createCoupleMessage(
    coupleId: number,
    payload: CreateWallMessage
): Promise<WallMessage> {
    const { data } = await api.post(`/api/wall/couple/${coupleId}`, payload);
    return data;
}

export async function toggleLike(id: number): Promise<{ isLiked: boolean; likesCount: number }> {
    const { data } = await api.post(`/api/likes/message/${id}/toggle`);
    return data;
}

export async function getLikeStatus(id: number): Promise<{ isLiked: boolean; likesCount: number }> {
    const { data } = await api.get(`/api/likes/message/${id}/status`);
    return data;
}

export async function getComments(messageId: number): Promise<Comment[]> {
    const { data } = await api.get(`/api/comments/message/${messageId}`);
    return data;
}

export async function createComment(messageId: number, payload: CreateCommentRequest): Promise<Comment> {
    const { data } = await api.post(`/api/comments/message/${messageId}`, payload);
    return data;
}

export async function updateComment(commentId: number, payload: CreateCommentRequest): Promise<Comment> {
    const { data } = await api.put(`/api/comments/${commentId}`, payload);
    return data;
}

export async function deleteComment(commentId: number): Promise<void> {
    await api.delete(`/api/comments/${commentId}`);
}

export async function uploadMedia(file: File, category: string = "messages"): Promise<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const { data } = await api.post("/api/media/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export async function deleteMedia(fileUrl: string): Promise<void> {
    await api.delete("/api/media", { params: { fileUrl } });
}
