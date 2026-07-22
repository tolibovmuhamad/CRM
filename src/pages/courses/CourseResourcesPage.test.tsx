import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { CourseResourcesPage } from './CourseResourcesPage';

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/courses/:id/resources" element={<CourseResourcesPage />} />
    </Routes>,
    { route: '/courses/c-javascript/resources', session: testSession('admin') },
  );
}

describe('CourseResourcesPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
  });

  it('показывает файлы курса с размером и датой', async () => {
    renderPage();

    expect(await screen.findByText('Day 1 — About JS.pdf')).toBeInTheDocument();
    // Размер переводится из байтов: 1 248 576 B ≈ 1,2 MB.
    expect(screen.getByText('1,2 MB')).toBeInTheDocument();
    // Файлы чужого курса на экран не попадают.
    expect(screen.queryByText('Introduction to .NET.pdf')).not.toBeInTheDocument();
  });

  it('фильтрует по типу файла', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Day 1 — About JS.pdf');

    await user.selectOptions(screen.getByLabelText('Тип'), 'video');

    await waitFor(() => {
      expect(screen.getByText('Lesson recording 01.mp4')).toBeInTheDocument();
      expect(screen.queryByText('Day 1 — About JS.pdf')).not.toBeInTheDocument();
    });
  });

  it('ищет по названию и предлагает сбросить фильтры', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Day 1 — About JS.pdf');

    await user.type(screen.getByRole('searchbox'), 'такого файла нет');
    expect(await screen.findByText('Ничего не нашли')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect(await screen.findByText('Day 1 — About JS.pdf')).toBeInTheDocument();
  });

  it('скачивание выключено до бэкенда', async () => {
    renderPage();
    await screen.findByText('Day 1 — About JS.pdf');

    const button = screen.getByRole('button', { name: 'Скачать файл Day 1 — About JS.pdf' });
    expect(button).toBeDisabled();
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить файлы/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Day 1 — About JS.pdf')).toBeInTheDocument();
  });
});
