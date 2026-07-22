import type { Config } from 'tailwindcss';
import { palette, spacing, radius, shadow, typography, fontFamily } from './src/shared/styles/tokens';

/**
 * Токены из `src/shared/styles/tokens.ts` (ТЗ §2).
 *
 * Шкалы, не зависящие от темы (отступы, радиусы, тени, типографика), берутся из
 * токенов напрямую. Цвета проксируются через CSS-переменные `--c-*`, а их значения
 * для светлой и тёмной темы заданы в `src/shared/styles/globals.css` — так один
 * переключатель темы (`data-theme`) меняет всю палитру без `dark:` в разметке.
 */

const px = <T extends Record<string, number>>(scale: T): Record<keyof T, string> =>
  Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, `${v}px`])) as Record<keyof T, string>;

const fontSize = Object.fromEntries(
  Object.entries(typography).map(([role, t]) => [
    role,
    [`${t.fontSize}px`, { lineHeight: `${t.lineHeight}px`, fontWeight: String(t.fontWeight) }],
  ]),
) as Config['theme'] & Record<string, unknown>;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: palette.white,
        black: palette.black,
        brand: {
          DEFAULT: 'var(--c-brand)',
          hover: 'var(--c-brand-hover)',
          active: 'var(--c-brand-active)',
          tint: 'var(--c-brand-tint)',
          subtle: 'var(--c-brand-subtle)',
          on: 'var(--c-brand-on)',
        },
        ink: {
          DEFAULT: 'var(--c-ink)',
          secondary: 'var(--c-ink-secondary)',
          muted: 'var(--c-ink-muted)',
          disabled: 'var(--c-ink-disabled)',
          inverse: 'var(--c-ink-inverse)',
          link: 'var(--c-ink-link)',
        },
        surface: {
          page: 'var(--c-surface-page)',
          card: 'var(--c-surface-card)',
          sunken: 'var(--c-surface-sunken)',
          hover: 'var(--c-surface-hover)',
        },
        line: {
          DEFAULT: 'var(--c-line)',
          strong: 'var(--c-line-strong)',
          subtle: 'var(--c-line-subtle)',
          focus: 'var(--c-line-focus)',
        },
        success: { DEFAULT: 'var(--c-success)', fg: 'var(--c-success-fg)', bg: 'var(--c-success-bg)' },
        warning: { DEFAULT: 'var(--c-warning)', fg: 'var(--c-warning-fg)', bg: 'var(--c-warning-bg)' },
        danger: { DEFAULT: 'var(--c-danger)', fg: 'var(--c-danger-fg)', bg: 'var(--c-danger-bg)' },
        late: { DEFAULT: 'var(--c-late)', fg: 'var(--c-late-fg)', bg: 'var(--c-late-bg)' },
        info: { DEFAULT: 'var(--c-info)', fg: 'var(--c-info-fg)', bg: 'var(--c-info-bg)' },
      },
      fontFamily: {
        sans: fontFamily.sans.split(',').map((f) => f.trim().replace(/^'|'$/g, '')),
      },
      fontSize,
      spacing: px(spacing),
      borderRadius: px(radius),
      boxShadow: shadow,
      ringColor: { focus: 'var(--c-line-focus)' },
    },
  },
  plugins: [],
} satisfies Config;
