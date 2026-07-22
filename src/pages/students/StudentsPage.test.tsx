import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { useStudentsViewStore } from '@/features/students-view/useStudentsViewStore';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { StudentsPage } from './StudentsPage';

function renderPage() {
  return renderWithProviders(<StudentsPage />, {
    route: '/students',
    session: testSession('admin'),
  });
}

describe('StudentsPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    useStudentsViewStore.setState({ view: 'list' });
    localStorage.clear();
  });

  it('показывает студентов из слоя данных (page → hook → api → mock)', async () => {
    renderPage();
    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
    // Группа приходит развёрнутой в ответе списка.
    expect(screen.getAllByText('C# 5 June').length).toBeGreaterThan(0);
  });

  it('листает страницы: на второй странице другие студенты', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Tojiev Olimjon');

    await user.click(screen.getByRole('button', { name: 'Следующая страница' }));

    expect(await screen.findByText('Rahmonova Dilnoza')).toBeInTheDocument();
    expect(screen.queryByText('Tojiev Olimjon')).not.toBeInTheDocument();
  });

  it('фильтрует по поиску и предлагает сбросить фильтры, когда ничего не найдено', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Tojiev Olimjon');

    // Zarina есть и в нефильтрованном списке, поэтому проверяем оба условия разом.
    await user.type(screen.getByRole('searchbox'), 'Zarina');
    await waitFor(() => {
      expect(screen.getByText('Karimova Zarina')).toBeInTheDocument();
      expect(screen.queryByText('Tojiev Olimjon')).not.toBeInTheDocument();
    });

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'такого студента нет');
    expect(await screen.findByText('Никого не нашли')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
  });

  it('удаляет студента только после подтверждения', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Ahmad Abdulsamad');

    await user.click(screen.getByRole('button', { name: 'Удалить студента Ahmad Abdulsamad' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/исчезнет из списков/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(screen.queryByText('Ahmad Abdulsamad')).not.toBeInTheDocument();
    });
  });

  it('показывает телефон родителя в поповере', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Tojiev Olimjon');

    await user.click(screen.getByRole('button', { name: 'Телефоны студента Tojiev Olimjon' }));

    // Подпись берётся из описания телефона, а не зашита в код.
    expect(screen.getByText('Отец')).toBeInTheDocument();
    expect(screen.getByText('93 435 4943')).toBeInTheDocument();
  });

  it('переключается на плитку и показывает карточки', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Tojiev Olimjon');

    await user.click(screen.getByRole('radio', { name: 'Плиткой' }));

    // На карточке есть пол и возраст, которых нет в таблице.
    expect(await screen.findAllByText('Мужской')).not.toHaveLength(0);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('на мобильной ширине показывает плитку вместо таблицы', async () => {
    window.innerWidth = 360;
    renderPage();

    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
    // Таблица на 360px непригодна — в мобильном макете список нарисован плиткой.
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();

    window.innerWidth = 1024;
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить список/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
  });
});
