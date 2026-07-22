import type { CrmApi } from './types';
import { mockApi } from './mock/mockApi';
import { httpApi } from './http/httpApi';

/**
 * Единая точка доступа к данным (ТЗ §6). Реализация выбирается по VITE_API_MODE,
 * без правок в компонентах. Сейчас поддержан только 'mock' (§12.1); 'http' —
 * заготовка, бросает 501.
 */
export const api: CrmApi = import.meta.env.VITE_API_MODE === 'http' ? httpApi : mockApi;

export type { CrmApi } from './types';
export { ApiError } from './errors';
export { queryKeys } from './queryKeys';
export * from './schemas';
