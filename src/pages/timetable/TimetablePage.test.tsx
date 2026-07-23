import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { TimetablePage } from './TimetablePage';

function renderPage() {
  return renderWithProviders(<TimetablePage />, {
    route: '/timetable',
    session: testSession('admin'),
  });
}

describe('TimetablePage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    window.innerWidth = 1024;
  });

  it('раскладывает занятия активных групп по дням недели', async () => {
    renderPage();
    // «C# 5 June» идёт пн/ср/пт — карточек несколько.
    expect((await screen.findAllByText('C# 5 June')).length).toBeGreaterThan(0);
  });

  it('не показывает занятия завершённых групп', async () => {
    renderPage();
    await screen.findAllByText('C# 5 June');
    // Группа «HTML & CSS June» завершена — в расписании её быть не должно.
    expect(screen.queryAllByText('HTML & CSS June')).toHaveLength(0);
  });

  it('фильтрует по курсу', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText('C# 5 June');

    await screen.findByRole('option', { name: 'C#' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Курс' }), 'c-csharp');

    await waitFor(() => {
      expect(screen.getAllByText('C# 5 June').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('React 1 August')).toHaveLength(0);
    });
  });

  it('фильтрует по ментору', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText('C# 5 June');

    await screen.findByRole('option', { name: 'Karimov Sardor' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Ментор' }), 'e-1');

    await waitFor(() => {
      // Karimov ведёт C# и Python, но не React (ментор e-2).
      expect(screen.getAllByText('C# 5 June').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('React 1 August')).toHaveLength(0);
    });
  });

  it('показывает пусто по филиалу без активных групп и сбрасывает фильтры', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText('C# 5 June');

    // В филиале «Душанбе, Сомони» (b-2) только завершённые группы.
    await screen.findByRole('option', { name: 'Душанбе, Сомони' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Филиал' }), 'b-2');

    expect(await screen.findByText('Ничего не нашли')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect((await screen.findAllByText('C# 5 June')).length).toBeGreaterThan(0);
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить расписание/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect((await screen.findAllByText('C# 5 June')).length).toBeGreaterThan(0);
  });
});
