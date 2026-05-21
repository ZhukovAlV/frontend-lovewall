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
    followersCount?: number;
    createdAt?: string;
    updatedAt?: string;
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
    commentsCount?: number;

    // User info (populated from user service)
    userName?: string;
    userAvatarUrl?: string;
}

export interface Comment {
    id: number;
    messageId: number;
    userId: number;
    text: string;
    createdAt: string;
    updatedAt?: string;

    // User info (populated from user service)
    userName?: string;
    userAvatarUrl?: string;
}

export interface CreateCommentRequest {
    text: string;
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

export interface LikeStatus {
    isLiked: boolean;
    likesCount: number;
}

export interface FollowStatus {
    isFollowing: boolean;
}

export interface MediaUploadResponse {
    success: string;
    fileUrl: string;
    fileName: string;
    fileSize: string;
    contentType: string;
}
