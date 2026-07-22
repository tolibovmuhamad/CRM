import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders } from '@/test/renderWithProviders';
import { AuthPage } from './AuthPage';

const DEMO_ADMIN_PHONE = '+992 900 00 00 01';

describe('AuthPage — вход', () => {
  beforeEach(() => {
    // В тестах задержку сети глушим, иначе каждый прогон ждёт 200–600 мс.
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    localStorage.clear();
  });

  it('не отправляет форму с пустыми полями и показывает ошибки у полей', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthPage tab="login" />, { route: '/login', session: null });

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Введите телефон')).toBeInTheDocument();
    expect(screen.getByText('Введите пароль')).toBeInTheDocument();
  });

  it('сообщает о неверном телефоне, не пуская дальше', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthPage tab="login" />, { route: '/login', session: null });

    await user.type(screen.getByLabelText('Телефон'), '+992 111 11 11 11');
    await user.type(screen.getByLabelText('Пароль'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Неверный телефон или пароль');
  });

  it('кладёт сессию в кэш после входа демо-аккаунтом', async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithProviders(<AuthPage tab="login" />, {
      route: '/login',
      session: null,
    });

    await user.type(screen.getByLabelText('Телефон'), DEMO_ADMIN_PHONE);
    await user.type(screen.getByLabelText('Пароль'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(queryClient.getQueryData(['session'])).toMatchObject({
        user: { role: 'admin', phone: DEMO_ADMIN_PHONE },
      });
    });
  });

  it('прячет и показывает пароль по кнопке', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthPage tab="login" />, { route: '/login', session: null });

    const password = screen.getByLabelText('Пароль');
    expect(password).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));
    expect(password).toHaveAttribute('type', 'text');
  });
});

describe('AuthPage — заявка на обучение', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
    localStorage.clear();
  });

  it('после отправки показывает экран «Заявка принята» и не создаёт сессию', async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithProviders(<AuthPage tab="signup" />, {
      route: '/signup',
      session: null,
    });

    await user.type(screen.getByLabelText('Имя'), 'Амир');
    await user.type(screen.getByLabelText('Фамилия'), 'Алиев');
    await user.type(screen.getByLabelText('Дата рождения'), '2005-04-12');
    await user.type(screen.getByLabelText('Адрес'), 'Душанбе, Рудаки 25');
    await user.type(screen.getByLabelText('Телефон'), '+992 900 12 34 56');
    await user.type(screen.getByLabelText('Телефон родителя'), '+992 900 65 43 21');
    await user.type(screen.getByLabelText('Пароль'), 'secret1');

    await user.click(screen.getByRole('button', { name: 'Оставить заявку' }));

    expect(await screen.findByText('Заявка принята')).toBeInTheDocument();
    expect(queryClient.getQueryData(['session'])).toBeNull();
  });

  it('требует телефон родителя', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthPage tab="signup" />, { route: '/signup', session: null });

    await user.type(screen.getByLabelText('Имя'), 'Амир');
    await user.click(screen.getByRole('button', { name: 'Оставить заявку' }));

    expect(await screen.findByText('Введите фамилию')).toBeInTheDocument();
    // Телефон и телефон родителя — два поля с одинаковым сообщением.
    expect(screen.getAllByText('Введите телефон')).toHaveLength(2);
  });
});
