import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { RootLayout } from './RootLayout';

/** Ссылки ищем по href, а не по подписи: подпись зависит от языка интерфейса. */
const links = (container: HTMLElement) =>
  [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));

describe('RootLayout (каркас)', () => {
  it('рендерит сайдбар, шапку и поиск', () => {
    renderWithProviders(<RootLayout />, { session: testSession('admin') });

    // Логотип в сайдбаре (SVG с aria-label).
    expect(screen.getAllByRole('img', { name: 'Omuz' }).length).toBeGreaterThan(0);
    // Поиск в шапке (input type=search).
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('прячет разделы, недоступные роли', () => {
    const admin = renderWithProviders(<RootLayout />, { session: testSession('admin') });
    expect(links(admin.container)).toContain('/administration');
    admin.unmount();

    const mentor = renderWithProviders(<RootLayout />, { session: testSession('mentor') });
    expect(links(mentor.container)).not.toContain('/administration');
    // Свой раздел ментору виден.
    expect(links(mentor.container)).toContain('/journal');
  });
});
