import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { mockApi } from '@/shared/api/mock/mockApi';
import { mockConfig } from '@/shared/api/mock/latency';
import { renderWithProviders, testSession } from '@/test/renderWithProviders';
import { StudentFormPage } from './StudentFormPage';

describe('StudentFormPage', () => {
  beforeEach(() => {
    mockConfig.minDelayMs = 0;
    mockConfig.maxDelayMs = 0;
    mockConfig.errorRate = 0;
  });

  it('не сохраняет пустую форму и показывает ошибки у полей', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentFormPage mode="create" />, {
      route: '/students/new',
      session: testSession('admin'),
    });

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByText('Введите имя')).toBeInTheDocument();
    expect(screen.getByText('Введите фамилию')).toBeInTheDocument();
    expect(screen.getByText('Введите телефон')).toBeInTheDocument();
  });

  it('создаёт студента: ФИО собирается из фамилии и имени', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentFormPage mode="create" />, {
      route: '/students/new',
      session: testSession('admin'),
    });

    await user.type(screen.getByLabelText('Имя'), 'Amir');
    await user.type(screen.getByLabelText('Фамилия'), 'Sattorov');
    await user.type(screen.getByLabelText('Телефон'), '900 123 456');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(async () => {
      const page = await mockApi.getStudents({ search: 'Sattorov' });
      expect(page.items[0]?.fullName).toBe('Sattorov Amir');
    });
  });

  it('добавляет и убирает дополнительный телефон', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentFormPage mode="create" />, {
      route: '/students/new',
      session: testSession('admin'),
    });

    await user.click(screen.getByRole('button', { name: 'Добавить телефон' }));
    expect(screen.getByLabelText('Дополнительный телефон 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить телефон 1' }));
    expect(screen.queryByLabelText('Дополнительный телефон 1')).not.toBeInTheDocument();
  });

  it('на правке подставляет данные студента и сохраняет изменения', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/students/:id/edit" element={<StudentFormPage mode="edit" />} />
      </Routes>,
      { route: '/students/s-1/edit', session: testSession('admin') },
    );

    const firstName = await screen.findByLabelText('Имя');
    await waitFor(() => expect(firstName).toHaveValue('Olimjon'));
    expect(screen.getByLabelText('Фамилия')).toHaveValue('Tojiev');
    // Дополнительный телефон из профиля тоже подставлен.
    expect(screen.getByLabelText('Дополнительный телефон 1')).toHaveValue('93 435 4943');

    await user.clear(screen.getByLabelText('Адрес'));
    await user.type(screen.getByLabelText('Адрес'), 'Худжанд, Ленина 3');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(async () => {
      const student = await mockApi.getStudent('s-1');
      expect(student.address).toBe('Худжанд, Ленина 3');
    });
  });
});
