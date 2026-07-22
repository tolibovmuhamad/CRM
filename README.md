# Omuz CRM — фронтенд

CRM учебного центра. Стек: React 18 + TypeScript (strict) + Vite, Tailwind, React Router, TanStack Query, Zustand, i18next (rus/taj/eng), Vitest. Подробности — в `TZ-omuz-crm.md` (ТЗ), `docs/` и `roadmap.md`.

## Запуск

```bash
npm install
cp .env.example .env   # при необходимости
npm run dev            # дев-сервер
```

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Дев-сервер Vite |
| `npm run build` | Проверка типов + прод-сборка |
| `npm run preview` | Предпросмотр прод-сборки |
| `npm run typecheck` | Проверка типов (`tsc -b`) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (запись) |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest (однократно); один файл — `npm run test:run -- src/shared/lib/money.test.ts` |

## Структура (Feature-Sliced, ТЗ §5)

`src/app` — вход, роутер, провайдеры · `src/pages` — экраны на роут · `src/widgets` — крупные блоки · `src/features` — действия пользователя · `src/entities` — сущности домена · `src/shared` — `ui` / `api` / `lib` / `i18n` / `styles` · `src/mocks` — фикстуры. Импорты только сверху вниз.

Дизайн-токены — `src/shared/styles/tokens.ts` (заведены в `tailwind.config.ts`; цвета темизируются через CSS-переменные в `globals.css`).
