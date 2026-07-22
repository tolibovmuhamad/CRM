import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { EnrollPage } from './EnrollPage';

// Recharts меряет контейнер, а в jsdom размеры нулевые — задаём их руками,
// иначе график не рендерится и падают все проверки вокруг него.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(256);
});

function renderPage() {
  return renderWithProviders(<EnrollPage />, {
    route: '/students/enroll',
    session: testSession('admin'),
  });
}

describe('EnrollPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
  });

  it('показывает записи и годовой итог', async () => {
    renderPage();

    expect(await screen.findByText('Nazarov Qurbonali')).toBeInTheDocument();
    // 16 записей в фикстуре, все за 2024 год.
    expect(await screen.findByText('16')).toBeInTheDocument();
  });

  it('фильтрует по месяцу', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nazarov Qurbonali');

    await user.selectOptions(screen.getByLabelText('Месяц'), '2024-06');

    await waitFor(() => {
      expect(screen.getByText('Tojiev Olimjon')).toBeInTheDocument();
      expect(screen.queryByText('Nazarov Qurbonali')).not.toBeInTheDocument();
    });
  });

  it('фильтрует по группе', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nazarov Qurbonali');

    await user.selectOptions(screen.getByLabelText('Группа'), 'g-react-1');

    await waitFor(() => {
      expect(screen.getByText('Ahmad Abdulsamad')).toBeInTheDocument();
      expect(screen.queryByText('Nazarov Qurbonali')).not.toBeInTheDocument();
    });
  });
});
