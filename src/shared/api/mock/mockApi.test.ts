import { beforeAll, describe, expect, it } from 'vitest';
import { ApiError } from '../errors';
import { mockApi } from './mockApi';
import { mockConfig } from './latency';

// Глушим задержку и ошибки, чтобы тесты были быстрыми и детерминированными.
beforeAll(() => {
  mockConfig.minDelayMs = 0;
  mockConfig.maxDelayMs = 0;
  mockConfig.errorRate = 0;
});

describe('mockApi.getStudents', () => {
  it('возвращает страницу с дефолтной пагинацией', async () => {
    const page = await mockApi.getStudents({});
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(20);
    expect(page.total).toBeGreaterThan(0);
    expect(page.items.length).toBe(page.total);
  });

  it('фильтрует по поиску', async () => {
    const page = await mockApi.getStudents({ search: 'Tojiev' });
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items.every((s) => s.fullName.includes('Tojiev'))).toBe(true);
  });

  it('фильтрует по статусу контракта', async () => {
    const page = await mockApi.getStudents({ contractStatus: 'ending_soon' });
    expect(page.items.every((s) => s.contractStatus === 'ending_soon')).toBe(true);
  });

  it('уважает размер страницы', async () => {
    const page = await mockApi.getStudents({ pageSize: 2 });
    expect(page.items).toHaveLength(2);
  });
});

describe('mockApi.getStudent', () => {
  it('находит студента по id', async () => {
    const student = await mockApi.getStudent('s-1');
    expect(student.id).toBe('s-1');
  });

  it('бросает ApiError 404 для несуществующего id', async () => {
    await expect(mockApi.getStudent('nope')).rejects.toBeInstanceOf(ApiError);
    await expect(mockApi.getStudent('nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('mockApi.createStudent', () => {
  it('создаёт студента, собирает ФИО и добавляет его в список', async () => {
    const before = await mockApi.getStudents({});
    const created = await mockApi.createStudent({
      firstName: 'Olim',
      lastName: 'Testov',
      phone: '900 000 000',
      status: 'active',
      phones: [],
    });
    expect(created.id).toBeTruthy();
    // ФИО собирает бэкенд: сначала фамилия, как в макете.
    expect(created.fullName).toBe('Testov Olim');
    expect(created.status).toBe('active');

    const after = await mockApi.getStudents({});
    expect(after.total).toBe(before.total + 1);
  });

  it('не сохраняет пустые необязательные поля', async () => {
    const created = await mockApi.createStudent({
      firstName: 'Bez',
      lastName: 'Pochty',
      phone: '900 000 001',
      status: 'active',
      phones: [],
      email: '',
      branchId: '',
    });
    expect(created.email).toBeUndefined();
    expect(created.branchId).toBeUndefined();
  });
});

describe('mockApi.updateStudent и deleteStudent', () => {
  it('обновляет поля и пересобирает ФИО', async () => {
    const updated = await mockApi.updateStudent('s-3', { lastName: 'Novyi' });
    expect(updated.fullName).toBe('Novyi Najibullo');
    expect(updated.phone).toBe('93 800 2275');
  });

  it('удаляет студента и больше его не находит', async () => {
    await mockApi.deleteStudent('s-16');
    await expect(mockApi.getStudent('s-16')).rejects.toMatchObject({ status: 404 });
  });

  it('бросает 404 на несуществующем id', async () => {
    await expect(mockApi.updateStudent('nope', { lastName: 'X' })).rejects.toMatchObject({
      status: 404,
    });
    await expect(mockApi.deleteStudent('nope')).rejects.toMatchObject({ status: 404 });
  });
});
