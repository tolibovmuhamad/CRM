import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { AdministrationPage } from './AdministrationPage';

function renderPage() {
  return renderWithProviders(<AdministrationPage />, {
    route: '/administration',
    session: testSession('admin'),
  });
}

describe('AdministrationPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    window.innerWidth = 1024;
  });

  it('на вкладке «Пользователи» показывает список с ролью', async () => {
    renderPage();
    expect(await screen.findByText('Sattorova Malika')).toBeInTheDocument();
    // «Администратор» есть и в фильтре ролей, и в бейдже — достаточно, что встречается.
    expect(screen.getAllByText('Администратор').length).toBeGreaterThan(0);
  });

  it('фильтрует пользователей по роли', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Sattorova Malika');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Роль' }), 'student');

    await waitFor(() => {
      expect(screen.getByText('Ahmad Abdulsamad')).toBeInTheDocument();
      expect(screen.queryByText('Sattorova Malika')).not.toBeInTheDocument();
    });
  });

  it('на вкладке «Роли» строит матрицу доступа', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Sattorova Malika');

    await user.click(screen.getByRole('tab', { name: 'Роли' }));

    expect(await screen.findByText('Раздел')).toBeInTheDocument();
    // Раздел из конфига навигации присутствует строкой матрицы.
    expect(screen.getByText('Студенты')).toBeInTheDocument();
  });

  it('на вкладке «Журнал действий» показывает записи и фильтрует по действию', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Sattorova Malika');

    await user.click(screen.getByRole('tab', { name: 'Журнал действий' }));

    expect(await screen.findByText('Студент «Tojiev Olimjon»')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Действие' }), 'delete');
    await waitFor(() => {
      expect(screen.getByText('Группа «React 2 November»')).toBeInTheDocument();
      expect(screen.queryByText('Студент «Tojiev Olimjon»')).not.toBeInTheDocument();
    });
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить пользователей/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Sattorova Malika')).toBeInTheDocument();
  });
});
