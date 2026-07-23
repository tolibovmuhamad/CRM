import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { SmsPage } from './SmsPage';

function renderPage() {
  return renderWithProviders(<SmsPage />, {
    route: '/sms',
    session: testSession('admin'),
  });
}

describe('SmsPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    window.innerWidth = 1024;
  });

  it('показывает композер с числом получателей и историю рассылок', async () => {
    renderPage();
    // Аудитория по умолчанию — «Студенты», их в фикстуре 16.
    expect(await screen.findByText('Получателей: 16')).toBeInTheDocument();
    expect(await screen.findByText(/Напоминаем об оплате/)).toBeInTheDocument();
  });

  it('пересчитывает получателей при выборе группы', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Получателей: 16');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Аудитория' }), 'group');
    // Группа ещё не выбрана — получателей 0.
    expect(await screen.findByText('Получателей: 0')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Группа' }), 'g-csharp-5');
    // В группе g-csharp-5 три студента (s-1, s-5, s-13).
    expect(await screen.findByText('Получателей: 3')).toBeInTheDocument();
  });

  it('вставляет шаблон в текст сообщения', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Получателей: 16');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Вставить шаблон' }), 'tpl-trial');

    const textarea = screen.getByRole('textbox', { name: 'Сообщение' });
    expect(textarea).toHaveValue(
      'Приглашаем вас на бесплатный пробный урок в учебном центре Omuz. Запись по телефону.',
    );
  });

  it('отправляет рассылку и показывает подтверждение', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Получателей: 16');

    await user.type(screen.getByRole('textbox', { name: 'Сообщение' }), 'Тестовое сообщение');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText(/Рассылка отправлена/)).toBeInTheDocument();
  });

  it('не даёт отправить пустое сообщение', async () => {
    renderPage();
    await screen.findByText('Получателей: 16');
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });
});
