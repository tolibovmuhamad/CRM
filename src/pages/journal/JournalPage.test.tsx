import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { JournalPage } from './JournalPage';

function renderPage(route = '/journal') {
  return renderWithProviders(<JournalPage />, {
    route,
    session: testSession('admin'),
  });
}

describe('JournalPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    window.innerWidth = 1024;
  });

  it('показывает журнал первой группы со студентами и счётчиками', async () => {
    renderPage();
    // Первая группа — «C# 5 June», студент s-1 → «Tojiev Olimjon».
    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
    expect(screen.getByText('Присутствовали')).toBeInTheDocument();
  });

  it('переключает группу и показывает её студентов', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Tojiev Olimjon');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Группа' }), 'g-uxui-1');

    await waitFor(() => {
      expect(screen.getByText('Karimova Zarina')).toBeInTheDocument();
      expect(screen.queryByText('Tojiev Olimjon')).not.toBeInTheDocument();
    });
  });

  it('открывает журнал по группе из адреса (?group=)', async () => {
    renderPage('/journal?group=g-uxui-1');
    expect(await screen.findByText('Karimova Zarina')).toBeInTheDocument();
  });

  it('показывает пусто для группы без студентов', async () => {
    // g-csharp-6 — запланированная группа, студентов пока нет.
    renderPage('/journal?group=g-csharp-6');
    expect(await screen.findByText('В группе пока нет студентов')).toBeInTheDocument();
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить журнал/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
  });
});
