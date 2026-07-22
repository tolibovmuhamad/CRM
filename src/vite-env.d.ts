/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Режим слоя данных (ТЗ §6). Сейчас поддержан только 'mock'. */
  readonly VITE_API_MODE: 'mock' | 'http';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
