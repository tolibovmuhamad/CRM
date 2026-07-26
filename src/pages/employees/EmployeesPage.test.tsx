import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { useEmployeesViewStore } from '@/features/employees-view/useEmployeesViewStore';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { EmployeesPage } from './EmployeesPage';

function renderPage() {
  return renderWithProviders(<EmployeesPage />, {
    route: '/employees',
    session: testSession('admin'),
  });
}

describe('EmployeesPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    useEmployeesViewStore.setState({ view: 'grid' });
    window.innerWidth = 1024;
    localStorage.clear();
  });

  it('показывает карточки сотрудников с должностью', async () => {
    renderPage();

    expect(await screen.findByText('Karimov Sardor')).toBeInTheDocument();
    // Должность выводится подписью из словаря ролей, а не кодом.
    expect(screen.getAllByText('Ментор').length).toBeGreaterThan(0);
  });

  it('фильтрует по должности', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Karimov Sardor');

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Должность' }),
      'developer',
    );

    await waitFor(() => {
      expect(screen.getByText('Nazarov Firuz')).toBeInTheDocument();
      expect(screen.queryByText('Karimov Sardor')).not.toBeInTheDocument();
    });
  });

  it('ищет по имени и предлагает сбросить фильтры', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Karimov Sardor');

    await user.type(screen.getByRole('searchbox'), 'такого нет');
    expect(await screen.findByText('Никого не нашли')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect(await screen.findByText('Karimov Sardor')).toBeInTheDocument();
  });

  it('переключается на таблицу и показывает уровень ментора', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Karimov Sardor');

    await user.click(screen.getByRole('radio', { name: 'Таблицей' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getAllByText('Уровень 3').length).toBeGreaterThan(0);
  });

  it('на мобильной ширине показывает плитку без переключателя вида', async () => {
    window.innerWidth = 360;
    useEmployeesViewStore.setState({ view: 'list' });
    renderPage();

    expect(await screen.findByText('Karimov Sardor')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();

    window.innerWidth = 1024;
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить сотрудников/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Karimov Sardor')).toBeInTheDocument();
  });
});
