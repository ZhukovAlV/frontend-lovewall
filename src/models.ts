export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    city?: string;
    country?: string;
    relationshipStatus?: string;
    privacy?: string;
    messagesCount?: number;
    likesCount?: number;
    subscribersCount?: number;
}

export interface WallMessage {
    id: number;
    userId: number;
    category?: string;
    text: string;
    mediaUrl?: string;
    isPublic?: boolean;
    city?: string;
    coordinates?: string;
    createdAt: string;
    updatedAt?: string;
    likes: number;
}

export interface AuthData {
    token: string;
    userId: number;
    email: string;
    name: string;
}

export interface WallFilters {
    city?: string;
    category?: string;
    query?: string;
}

export interface CreateWallMessage {
    text: string;
    category?: string;
    city?: string;
    mediaUrl?: string;
    isPublic?: boolean;
}
