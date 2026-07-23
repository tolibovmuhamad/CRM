import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { PaymentsPage } from './PaymentsPage';

function renderPage() {
  return renderWithProviders(<PaymentsPage />, {
    route: '/accounting',
    session: testSession('admin'),
  });
}

describe('PaymentsPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    window.innerWidth = 1024;
  });

  it('показывает платежи с именем студента и сводкой', async () => {
    renderPage();
    // p-1 принадлежит s-1 → «Tojiev Olimjon».
    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
    expect(screen.getByText('Собрано')).toBeInTheDocument();
  });

  it('фильтрует по статусу «Ожидается»', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Tojiev Olimjon');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'pending');

    await waitFor(() => {
      // Ожидающий платёж p-3 принадлежит s-3.
      expect(screen.getByText('Shamsuddinov Najibullo')).toBeInTheDocument();
      // s-1 платит только оплаченным платежом — при фильтре его быть не должно.
      expect(screen.queryByText('Tojiev Olimjon')).not.toBeInTheDocument();
    });
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить платежи/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Tojiev Olimjon')).toBeInTheDocument();
  });
});
