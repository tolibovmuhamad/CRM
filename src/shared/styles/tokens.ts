/**
 * Дизайн-токены Omuz CRM.
 *
 * Источник — макет Figma «Omuz CRM (Copy)», этап 0. Значения собраны из UI-Kit
 * (Typography, Buttons, Text Inputs, Components) и экранов частотным анализом
 * fills / textStyles / cornerRadius / effects / itemSpacing.
 *
 * Слой 1 — `palette`: сырые именованные цвета (примитивы), менять только вслед за макетом.
 * Слой 2 — `color`: семантические роли, ссылаются на палитру. В компонентах использовать
 * только семантику (`color.text.primary`), не примитивы (`palette.indigo600`).
 *
 * Файл нейтрален к способу стилизации: одинаково скармливается и в `tailwind.config`,
 * и в CSS-переменные. Решение Tailwind vs CSS Modules — см. docs/screens.md / ТЗ §2.
 *
 * Именованные текст-стили Figma (styles endpoint отдал 403 — scope library_content:read
 * недоступен на Free-плане), поэтому H1–H6 сняты напрямую с текст-нод UI-Kit.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Слой 1. Примитивы
// ─────────────────────────────────────────────────────────────────────────────

export const palette = {
  white: '#FFFFFF',
  black: '#141316',

  // Бренд — индиго Omuz
  indigo50: '#F4F3FF',
  indigo100: '#E2E0FF',
  indigo500: '#6055F2',
  indigo600: '#4A3AFF', // основной бренд
  indigo900: '#231A97', // тёмный / pressed

  // Нейтральная шкала (текст, фоны)
  neutral900: '#262626', // основной текст
  neutral700: '#404040',
  neutral600: '#525252',
  neutral500: '#737373', // вторичный текст
  neutral400: '#A3A3A3',
  neutral300: '#D1D5DB',
  neutral200: '#E5E7EB',
  neutral100: '#F3F4F6',
  neutral50: '#FAFAFA',

  // Slate (границы, приглушённый текст, подложки) — шкала Tailwind slate
  slate900: '#0E1422',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#506A85',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate50: '#F8FAFC',

  // Статусы
  green500: '#00D84A',
  green600: '#22C55E',
  green800: '#2E7D32',
  green900: '#1B5E20',
  greenTint: '#E5FFEE',

  yellow500: '#EAB100',

  red500: '#EF4444',
  red700: '#BA1A1A',
  redTint: '#FEF2F2',

  orange500: '#FF5700',
  orange600: '#EA580C',

  cyan400: '#22D3EE',
  blue400: '#559FFF',
  blue600: '#0284C7',
  blueTint: '#BAE6FD',

  // Полупрозрачные подложки бейджей (~24% альфа из макета)
  greenBadgeBg: 'rgba(0, 189, 64, 0.24)',
  yellowBadgeBg: 'rgba(234, 177, 0, 0.24)',
  redBadgeBg: 'rgba(239, 68, 68, 0.24)',
  orangeBadgeBg: 'rgba(234, 88, 12, 0.24)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Слой 2. Семантика
// ─────────────────────────────────────────────────────────────────────────────

export const color = {
  brand: {
    default: palette.indigo600,
    hover: palette.indigo500,
    active: palette.indigo900,
    tint: palette.indigo100,
    subtle: palette.indigo50,
    onBrand: palette.white,
  },
  text: {
    primary: palette.neutral900,
    secondary: palette.neutral500,
    muted: palette.slate400,
    disabled: palette.neutral400,
    inverse: palette.white,
    link: palette.indigo600,
  },
  surface: {
    page: palette.slate50, // фон приложения
    card: palette.white,
    raised: palette.white,
    sunken: palette.neutral100,
    hover: palette.neutral50,
  },
  border: {
    default: palette.slate200,
    strong: palette.slate300,
    subtle: palette.neutral200,
    focus: palette.indigo600,
  },
  status: {
    success: {
      fg: palette.green800,
      solid: palette.green500,
      bg: palette.greenTint,
      badge: palette.greenBadgeBg,
    },
    warning: {
      fg: palette.yellow500,
      solid: palette.yellow500,
      bg: palette.yellowBadgeBg,
      badge: palette.yellowBadgeBg,
    },
    danger: {
      fg: palette.red700,
      solid: palette.red500,
      bg: palette.redTint,
      badge: palette.redBadgeBg,
    },
    late: {
      fg: palette.orange600,
      solid: palette.orange500,
      bg: palette.orangeBadgeBg,
      badge: palette.orangeBadgeBg,
    },
    info: {
      fg: palette.blue600,
      solid: palette.blue400,
      bg: palette.blueTint,
      badge: palette.blueTint,
    },
  },
  focusRing: palette.indigo600,
} as const;

/** Палитра для графиков дашборда (Recharts). Порядок = порядок серий по умолчанию. */
export const chart = {
  leads: palette.yellow500,
  income: palette.indigo600,
  enroll: palette.indigo600,
  present: palette.green500,
  late: palette.green600, // «Late» на area-графике посещаемости — зелёная линия
  absent: palette.red500,
  leftCourses: palette.cyan400,
  categorical: [
    palette.indigo600,
    palette.green600,
    palette.orange500,
    palette.yellow500,
    palette.cyan400,
    palette.blue400,
    palette.red500,
    palette.slate500,
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Типографика
// ─────────────────────────────────────────────────────────────────────────────

export const fontFamily = {
  // Основной шрифт макета. Poppins/Inter/Roboto встречаются точечно (экраны входа,
  // встроенные Material-компоненты) — в проект их не тянуть без явной надобности.
  sans: "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/** Роли текста: [fontSize, lineHeight, fontWeight] в px. */
export const typography = {
  h1: { fontSize: 40, lineHeight: 48, fontWeight: fontWeight.bold },
  h2: { fontSize: 32, lineHeight: 40, fontWeight: fontWeight.bold },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: fontWeight.bold },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.bold },
  h5: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.bold },
  h6: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.bold },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular },
  body: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular },
  bodySm: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular },
  /** Кнопки, заголовки таблиц, активные пункты меню — самая частая роль в макете. */
  label: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.semibold },
  labelSm: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.medium },
  caption: { fontSize: 10, lineHeight: 14, fontWeight: fontWeight.medium },
  micro: { fontSize: 8, lineHeight: 12, fontWeight: fontWeight.medium },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Отступы, радиусы, тени
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Сетка 4px. Значения 6 и 10 в макете встречаются часто — это осознанные шаги,
 * а не мусор, поэтому оставлены в шкале. Строгой кратности 8 нет.
 */
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  13: 52, // высота кнопки на формах входа/регистрации
  14: 56, // высота крупного поля ввода (Text Input формы)
  15: 60,
} as const;

export const radius = {
  sm: 4,
  md: 8, // радиус по умолчанию (кнопки, инпуты, карточки)
  lg: 12,
  xl: 16,
  '2xl': 20, // крупные карточки-блоки дашборда
  full: 9999, // пилюли, аватары, чипы
} as const;

export const shadow = {
  sm: '0 2.67px 5.33px rgba(50, 50, 71, 0.06)',
  card: '0 8px 24px rgba(0, 0, 0, 0.16)',
  dropdown: '0 4px 24px rgba(0, 0, 0, 0.16)',
  brandGlow: '0 4px 8px rgba(74, 58, 255, 0.40)', // свечение под primary-кнопкой
} as const;

/** Единый transition для интерактивных состояний. */
export const motion = {
  fast: '120ms ease',
  base: '160ms ease',
} as const;
