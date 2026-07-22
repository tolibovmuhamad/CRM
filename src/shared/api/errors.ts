/** Ошибка слоя данных. Мок и будущий HTTP-клиент бросают именно её. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Заглушка для нереализованных методов HTTP-клиента (ТЗ §12.1: пока только моки). */
export function notImplemented(method: string): never {
  throw new ApiError(
    501,
    `HTTP API не реализован: ${method}. Сейчас доступен только режим VITE_API_MODE=mock.`,
  );
}
