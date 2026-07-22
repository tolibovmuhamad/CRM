import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { useCoursesViewStore } from '@/features/courses-view/useCoursesViewStore';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { CoursesPage } from './CoursesPage';

function renderPage() {
  return renderWithProviders(<CoursesPage />, {
    route: '/courses',
    session: testSession('admin'),
  });
}

describe('CoursesPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    useCoursesViewStore.setState({ view: 'grid' });
    window.innerWidth = 1024;
    localStorage.clear();
  });

  it('показывает карточки курсов со стоимостью в сомони', async () => {
    renderPage();

    expect(await screen.findByText('JavaScript')).toBeInTheDocument();
    // Стоимость хранится в дирамах (100000) и выводится в сомони (ТЗ §9).
    expect(screen.getAllByText(/1 000/).length).toBeGreaterThan(0);
  });

  it('ищет по названию курса и предлагает сбросить фильтры', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('JavaScript');

    await user.type(screen.getByRole('searchbox'), 'Python');
    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    });

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'такого курса нет');
    expect(await screen.findByText('Ничего не нашли')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect(await screen.findByText('JavaScript')).toBeInTheDocument();
  });

  it('переключается на таблицу и показывает расписание с длительностью', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('JavaScript');

    await user.click(screen.getByRole('radio', { name: 'Таблицей' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    // Дни недели переведены, а не выведены кодами.
    expect(screen.getAllByText(/Пн, Ср, Пт/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('3 month').length).toBeGreaterThan(0);
  });

  it('на мобильной ширине показывает плитку без переключателя вида', async () => {
    window.innerWidth = 360;
    useCoursesViewStore.setState({ view: 'list' });
    renderPage();

    expect(await screen.findByText('JavaScript')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();

    window.innerWidth = 1024;
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить курсы/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('JavaScript')).toBeInTheDocument();
  });
});
