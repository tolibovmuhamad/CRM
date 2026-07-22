import { ApiError } from '../errors';

/**
 * Поведение моков (ТЗ §6). Задержка 200–600 мс, умеют возвращать ошибку —
 * иначе состояния загрузки и ошибки не проверить.
 *
 * `errorRate` по умолчанию 0, чтобы обычная разработка не падала. Чтобы вручную
 * проверить состояние ошибки — выставить в консоли `mockConfig.errorRate = 1`.
 * В тестах задержку глушат (`mockConfig.minDelayMs = mockConfig.maxDelayMs = 0`).
 */
export const mockConfig = {
  minDelayMs: 200,
  maxDelayMs: 600,
  /** Вероятность ошибки на каждый запрос, 0..1. */
  errorRate: 0,
};

function randomDelay(): Promise<void> {
  const { minDelayMs, maxDelayMs } = mockConfig;
  const ms = minDelayMs + Math.random() * Math.max(0, maxDelayMs - minDelayMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Имитация сети: задержка + возможная ошибка. Вызывать в начале каждого мок-метода. */
export async function simulateNetwork(): Promise<void> {
  await randomDelay();
  if (mockConfig.errorRate > 0 && Math.random() < mockConfig.errorRate) {
    throw new ApiError(503, 'Смоделированная ошибка сети (mockConfig.errorRate).');
  }
}
