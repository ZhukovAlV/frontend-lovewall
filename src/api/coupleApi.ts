import axios from 'axios';
import { Couple, CreateCoupleRequest, UpdateCoupleRequest } from '../models';

const API_BASE_URL = import.meta.env.VITE_API_USER_SERVICE_URL?.trim() || 'http://192.168.1.99:8081';

// Создать экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Добавить токен авторизации к запросам
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
        config.headers['X-User-Id'] = userId;
    }

    return config;
});

/**
 * Создать приглашение в пару
 */
export const createCoupleInvitation = async (request: CreateCoupleRequest): Promise<Couple> => {
    const response = await api.post('/api/couples/invite', request);
    return response.data;
};

/**
 * Принять приглашение в пару
 */
export const acceptCoupleInvitation = async (coupleId: number): Promise<Couple> => {
    const response = await api.post(`/api/couples/${coupleId}/accept`);
    return response.data;
};

/**
 * Отклонить приглашение в пару
 */
export const rejectCoupleInvitation = async (coupleId: number): Promise<void> => {
    await api.post(`/api/couples/${coupleId}/reject`);
};

/**
 * Получить активную пару текущего пользователя
 */
export const getMyActiveCouple = async (): Promise<Couple | null> => {
    try {
        const response = await api.get('/api/couples/my');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

/**
 * Получить информацию о паре по ID
 */
export const getCoupleById = async (coupleId: number): Promise<Couple | null> => {
    try {
        const response = await api.get(`/api/couples/${coupleId}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

/**
 * Обновить информацию о паре
 */
export const updateCouple = async (coupleId: number, request: UpdateCoupleRequest): Promise<Couple> => {
    const response = await api.put(`/api/couples/${coupleId}`, request);
    return response.data;
};

/**
 * Завершить отношения (разорвать пару)
 */
export const endCouple = async (coupleId: number): Promise<void> => {
    await api.post(`/api/couples/${coupleId}/end`);
};

/**
 * Получить входящие приглашения
 */
export const getPendingInvitations = async (): Promise<Couple[]> => {
    const response = await api.get('/api/couples/invitations/received');
    return response.data;
};

/**
 * Получить отправленные приглашения
 */
export const getSentInvitations = async (): Promise<Couple[]> => {
    const response = await api.get('/api/couples/invitations/sent');
    return response.data;
};

/**
 * Получить все публичные активные пары
 */
export const getAllActiveCouples = async (): Promise<Couple[]> => {
    const response = await api.get('/api/couples/public');
    return response.data;
};

/**
 * Поиск пар по имени
 */
export const searchCouples = async (name: string): Promise<Couple[]> => {
    const response = await api.get('/api/couples/search', {
        params: { name }
    });
    return response.data;
};

/**
 * Получить историю пар пользователя
 */
export const getCoupleHistory = async (): Promise<Couple[]> => {
    const response = await api.get('/api/couples/my/history');
    return response.data;
};
