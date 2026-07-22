import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { GraduatesPage } from './GraduatesPage';

function renderPage() {
  return renderWithProviders(<GraduatesPage />, {
    route: '/students/graduates',
    session: testSession('admin'),
  });
}

describe('GraduatesPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
  });

  it('показывает счётчики и первую страницу выпускников', async () => {
    renderPage();

    expect(await screen.findByText('Zabiri Alijon')).toBeInTheDocument();
    // Всего 14 выпускников в фикстуре, из них 4 работают.
    expect(await screen.findByText('14')).toBeInTheDocument();
    expect(screen.getByText('#Ud2024 04')).toBeInTheDocument();
  });

  it('ищет по серии сертификата, а не только по имени', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Zabiri Alijon');

    await user.type(screen.getByRole('searchbox'), '#Ud2024 09');

    await waitFor(() => {
      expect(screen.getByText('Yusupov Behruz')).toBeInTheDocument();
      expect(screen.queryByText('Zabiri Alijon')).not.toBeInTheDocument();
    });
  });

  it('фильтрует по трудоустройству', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Zabiri Alijon');

    await user.selectOptions(screen.getByLabelText('Трудоустройство'), 'open_to_work');

    await waitFor(() => {
      expect(screen.getByText('Inoyatzoda Shodmon')).toBeInTheDocument();
      expect(screen.queryByText('Zabiri Alijon')).not.toBeInTheDocument();
    });
  });

  it('показывает ошибку и даёт повторить', async () => {
    mockConfig.errorRate = 1;
    renderPage();

    expect(await screen.findByText(/Не удалось загрузить выпускников/)).toBeInTheDocument();

    mockConfig.errorRate = 0;
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Zabiri Alijon')).toBeInTheDocument();
  });
});
