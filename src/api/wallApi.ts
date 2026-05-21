import http from "../http";
import { CreateWallMessage, WallFilters, WallMessage, Comment, CreateCommentRequest } from "../models";

export async function fetchWall(filters: WallFilters = {}): Promise<WallMessage[]> {
    const { data } = await http.get("/api/wall/public", { params: filters });
    return data;
}

export async function createMessage(payload: CreateWallMessage): Promise<WallMessage> {
    const { data } = await http.post("/api/wall", payload);
    return data;
}

export async function updateMessage(id: number, payload: CreateWallMessage): Promise<WallMessage> {
    const { data } = await http.put(`/api/wall/${id}`, payload);
    return data;
}

export async function deleteMessage(id: number): Promise<void> {
    await http.delete(`/api/wall/${id}`);
}

// Enhanced likes system
export async function toggleLike(id: number): Promise<{ isLiked: boolean; likesCount: number }> {
    const { data } = await http.post(`/api/wall/${id}/like`);
    return data;
}

export async function getLikeStatus(id: number): Promise<{ isLiked: boolean; likesCount: number }> {
    const { data } = await http.get(`/api/wall/${id}/like-status`);
    return data;
}

// Comments functionality
export async function getComments(messageId: number): Promise<Comment[]> {
    const { data } = await http.get(`/api/wall/${messageId}/comments`);
    return data;
}

export async function createComment(messageId: number, payload: CreateCommentRequest): Promise<Comment> {
    const { data } = await http.post(`/api/wall/${messageId}/comments`, payload);
    return data;
}

export async function updateComment(commentId: number, payload: CreateCommentRequest): Promise<Comment> {
    const { data } = await http.put(`/api/comments/${commentId}`, payload);
    return data;
}

export async function deleteComment(commentId: number): Promise<void> {
    await http.delete(`/api/comments/${commentId}`);
}

// Media upload
export async function uploadMedia(file: File, category: string = "messages"): Promise<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const { data } = await http.post("/api/media/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export async function deleteMedia(fileUrl: string): Promise<void> {
    await http.delete("/api/media", { params: { fileUrl } });
}
