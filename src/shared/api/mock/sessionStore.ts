import { sessionSchema, type Session } from '../schemas';

const STORAGE_KEY = 'omuz-session';

/**
 * Хранилище сессии мок-режима: то, что при реальном бэкенде будет httpOnly-кукой
 * или refresh-токеном. Живёт внутри `shared/api/mock`, наружу не торчит —
 * компоненты ходят через `api.getSession()` и не знают про localStorage.
 *
 * Битую запись молча выбрасываем: невалидная сессия равносильна её отсутствию.
 */
export const sessionStore = {
  read(): Session | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = sessionSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  },

  write(session: Session) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Приватный режим/переполнение — вход всё равно работает до перезагрузки.
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // см. write
    }
  },
};
