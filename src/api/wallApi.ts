import http from "../http";
import { CreateWallMessage, WallFilters, WallMessage } from "../models";

export async function fetchWall(filters: WallFilters = {}): Promise<WallMessage[]> {
    const { data } = await http.get("/api/wall/public", { params: filters });
    return data;
}

export async function createMessage(payload: CreateWallMessage): Promise<WallMessage> {
    const { data } = await http.post("/api/wall", payload);
    return data;
}

export async function likeMessage(id: number): Promise<WallMessage> {
    const { data } = await http.post(`/api/wall/${id}/like`);
    return data;
}
