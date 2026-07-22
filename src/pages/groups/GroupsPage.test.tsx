import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { useGroupsViewStore } from '@/features/groups-view/useGroupsViewStore';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { GroupsPage } from './GroupsPage';

function renderPage() {
  return renderWithProviders(<GroupsPage />, {
    route: '/groups',
    session: testSession('admin'),
  });
}

describe('GroupsPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    useGroupsViewStore.setState({ view: 'grid' });
    window.innerWidth = 1024;
    localStorage.clear();
  });

  it('показывает карточки групп', async () => {
    renderPage();

    expect(await screen.findByText('C# 5 June')).toBeInTheDocument();
    // Занятость группы: 14 из 15 мест.
    expect(screen.getByText('14/15')).toBeInTheDocument();
  });

  it('фильтрует по статусу группы', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('C# 5 June');

    await user.selectOptions(screen.getByLabelText('Статус'), 'planned');

    await waitFor(() => {
      expect(screen.getByText('C# 6 October')).toBeInTheDocument();
      expect(screen.queryByText('C# 5 June')).not.toBeInTheDocument();
    });
  });

  it('фильтрует по филиалу и предлагает сбросить фильтры', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('C# 5 June');

    await user.selectOptions(screen.getByLabelText('Филиал'), 'b-3');
    await waitFor(() => {
      expect(screen.getByText('C# 6 October')).toBeInTheDocument();
      expect(screen.queryByText('React 1 August')).not.toBeInTheDocument();
    });

    // Кнопка сброса живёт в пустом состоянии, поэтому доводим фильтры до нуля совпадений.
    await user.type(screen.getByRole('searchbox'), 'такой группы нет');
    expect(await screen.findByText('Ничего не нашли')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect(await screen.findByText('React 1 August')).toBeInTheDocument();
  });

  it('переключается на таблицу и показывает расписание', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('C# 5 June');

    await user.click(screen.getByRole('radio', { name: 'Таблицей' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    // Дни недели переведены, а не выведены кодами.
    expect(screen.getAllByText(/Пн, Ср, Пт/).length).toBeGreaterThan(0);
  });

  it('на мобильной ширине показывает плитку без переключателя вида', async () => {
    window.innerWidth = 360;
    useGroupsViewStore.setState({ view: 'list' });
    renderPage();

    expect(await screen.findByText('C# 5 June')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();

    window.innerWidth = 1024;
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить группы/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('C# 5 June')).toBeInTheDocument();
  });
});
