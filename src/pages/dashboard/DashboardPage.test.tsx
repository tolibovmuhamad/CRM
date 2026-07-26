import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { DashboardPage } from './DashboardPage';

function renderPage() {
  return renderWithProviders(<DashboardPage />, {
    route: '/',
    session: testSession('admin'),
  });
}

describe('DashboardPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    window.innerWidth = 1024;
  });

  it('показывает плитки-счётчики и трудоустроенных выпускников', async () => {
    renderPage();
    // Первый трудоустроенный выпускник из фикстуры.
    expect(await screen.findByText('Zabiri Alijon')).toBeInTheDocument();
    expect(screen.getByText('Студенты')).toBeInTheDocument();
    expect(screen.getByText('Собрано')).toBeInTheDocument();
  });

  it('показывает блоки графиков записей и дохода', async () => {
    renderPage();
    await screen.findByText('Zabiri Alijon');
    expect(screen.getByText('Записи по месяцам, 2024')).toBeInTheDocument();
    expect(screen.getByText('Доход по группам')).toBeInTheDocument();
    expect(screen.getByText('Трудоустроенные выпускники')).toBeInTheDocument();
  });

  it('показывает ошибку при сбое загрузки', async () => {
    mockConfig.errorRate = 1;
    renderPage();
    expect((await screen.findAllByText(/Не удалось загрузить данные/)).length).toBeGreaterThan(0);
  });
});
