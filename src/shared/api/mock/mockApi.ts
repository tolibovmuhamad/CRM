import { ApiError } from '../errors';
import type { CrmApi } from '../types';
import {
  branchesQuerySchema,
  buildFullName,
  courseResourcesQuerySchema,
  coursesQuerySchema,
  createStudentDtoSchema,
  type EmploymentStatus,
  enrollmentsQuerySchema,
  enrollmentStatsSchema,
  graduatesQuerySchema,
  graduateStatsSchema,
  employeesQuerySchema,
  groupsQuerySchema,
  logsQuerySchema,
  usersQuerySchema,
  journalQuerySchema,
  journalSchema,
  loginDtoSchema,
  paginatedSchema,
  paymentsQuerySchema,
  paymentStatsSchema,
  sendSmsDtoSchema,
  sessionSchema,
  signupDtoSchema,
  signupRequestSchema,
  type SmsAudience,
  smsAudienceCountSchema,
  smsAudienceInputSchema,
  smsMailingSchema,
  smsMailingsQuerySchema,
  smsTemplatesSchema,
  studentSchema,
  studentsQuerySchema,
  timetableQuerySchema,
  timetableSchema,
  updateStudentDtoSchema,
} from '../schemas';
import { normalizePhone } from '@/mocks/fixtures/accounts';
import { db } from './db';
import { buildJournalData } from './journal';
import { queryList } from './queryList';
import { simulateNetwork } from './latency';
import { sessionStore } from './sessionStore';

/**
 * Пустые строки из формы (незаполненный Email, Branch) — это «поле не задано»,
 * а не значение: иначе схема ответа справедливо ругается на пустой email.
 */
function stripEmpty<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '')) as Partial<T>;
}

/** Число получателей аудитории рассылки — считается из реальных данных БД. */
function smsAudienceCount(audience: SmsAudience, groupId?: string): number {
  switch (audience) {
    case 'students':
      return db.students.length;
    case 'group':
      return groupId
        ? db.students.filter((s) => s.groups.some((g) => g.id === groupId)).length
        : 0;
    case 'leads':
      return db.signupRequests.length;
    case 'graduates':
      return db.graduates.length;
    case 'mentors':
      return db.employees.filter((e) => e.position === 'mentor').length;
  }
}

/**
 * Мок-реализация CrmApi (ТЗ §6). Каждый метод: имитация сети → выборка через
 * общий queryList → валидация ответа схемой. Входной query тоже валидируется
 * (и получает дефолты пагинации).
 */
export const mockApi: CrmApi = {
  async login(dto) {
    const data = loginDtoSchema.parse(dto);
    await simulateNetwork();
    const phone = normalizePhone(data.phone);
    const user = db.accounts.find((a) => normalizePhone(a.phone) === phone);
    // Пароль в моках не проверяем (решение заказчика) — но пустой не пропускаем: 401 нужен, чтобы экран показал ошибку входа.
    if (!user) throw new ApiError(401, 'Неверный телефон или пароль');
    const session = sessionSchema.parse({ token: `mock-${user.id}-${Date.now()}`, user });
    sessionStore.write(session);
    return session;
  },

  async logout() {
    await simulateNetwork();
    sessionStore.clear();
  },

  async getSession() {
    // Без simulateNetwork: восстановление сессии не должно давать пустой экран
    // на старте и не должно случайно падать по errorRate.
    return sessionStore.read();
  },

  async signup(dto) {
    const data = signupDtoSchema.parse(dto);
    await simulateNetwork();
    const request = signupRequestSchema.parse({
      id: crypto.randomUUID(),
      fullName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      parentPhone: data.parentPhone,
      birthDate: data.birthDate,
      address: data.address,
      createdAt: new Date().toISOString(),
    });
    db.signupRequests.unshift(request);
    return request;
  },

  async getStudents(query) {
    const q = studentsQuerySchema.parse(query ?? {});
    await simulateNetwork();
    const result = queryList(db.students, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['fullName', 'phone'],
      filter: (s) =>
        (!q.courseId || s.courseId === q.courseId) &&
        (!q.groupId || s.groups.some((g) => g.id === q.groupId)) &&
        (!q.contractStatus || s.contractStatus === q.contractStatus),
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
    return paginatedSchema(studentSchema).parse(result);
  },

  async getStudent(id) {
    await simulateNetwork();
    const student = db.students.find((s) => s.id === id);
    if (!student) throw new ApiError(404, `Студент ${id} не найден`);
    return student;
  },

  async createStudent(dto) {
    const data = createStudentDtoSchema.parse(dto);
    await simulateNetwork();
    const student = studentSchema.parse({
      ...stripEmpty(data),
      id: crypto.randomUUID(),
      fullName: buildFullName(data.firstName, data.lastName),
      // Группы и курс проставляются на экране Enroll students, не здесь.
      groups: [],
      hasAccount: false,
      contractStatus: 'active',
      enrolledAt: new Date().toISOString(),
      isPremium: false,
    });
    db.students.unshift(student);
    return student;
  },

  async updateStudent(id, dto) {
    const data = updateStudentDtoSchema.parse(dto);
    await simulateNetwork();
    const index = db.students.findIndex((s) => s.id === id);
    if (index === -1) throw new ApiError(404, `Студент ${id} не найден`);
    const current = db.students[index];
    const merged = { ...current, ...stripEmpty(data) };
    const student = studentSchema.parse({
      ...merged,
      fullName: buildFullName(merged.firstName, merged.lastName),
    });
    db.students[index] = student;
    return student;
  },

  async deleteStudent(id) {
    await simulateNetwork();
    const index = db.students.findIndex((s) => s.id === id);
    if (index === -1) throw new ApiError(404, `Студент ${id} не найден`);
    db.students.splice(index, 1);
  },

  async getGroups(query) {
    const q = groupsQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.groups, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['name'],
      filter: (g) =>
        (!q.courseId || g.courseId === q.courseId) &&
        (!q.mentorId || g.mentorId === q.mentorId) &&
        (!q.branchId || g.branchId === q.branchId) &&
        (!q.status || g.status === q.status),
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
  },

  async getGroup(id) {
    await simulateNetwork();
    const group = db.groups.find((g) => g.id === id);
    if (!group) throw new ApiError(404, `Группа ${id} не найдена`);
    return group;
  },

  async getCourses(query) {
    const q = coursesQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.courses, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['name'],
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
  },

  async getCourse(id) {
    await simulateNetwork();
    const course = db.courses.find((c) => c.id === id);
    if (!course) throw new ApiError(404, `Курс ${id} не найден`);
    return course;
  },

  async getCourseResources(query) {
    const q = courseResourcesQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.resources, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['name'],
      filter: (r) =>
        (!q.courseId || r.courseId === q.courseId) && (!q.type || r.type === q.type),
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
  },

  async getGraduates(query) {
    const q = graduatesQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.graduates, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      // По серии сертификата ищут так же, как по имени («Search by name, serial»).
      searchFields: ['fullName', 'serial'],
      filter: (g) =>
        (!q.employmentStatus || g.employmentStatus === q.employmentStatus) &&
        (!q.courseId || g.courseId === q.courseId) &&
        (!q.groupId || g.groupId === q.groupId) &&
        (!q.issuedFrom || g.issuedAt >= q.issuedFrom),
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
  },

  async getGraduateStats() {
    await simulateNetwork();
    const by = (status: EmploymentStatus) =>
      db.graduates.filter((g) => g.employmentStatus === status).length;
    return graduateStatsSchema.parse({
      total: db.graduates.length,
      employed: by('employed'),
      openToWork: by('open_to_work'),
      freelancer: by('freelancer'),
      furtherEdu: by('further_edu'),
    });
  },

  async getEnrollments(query) {
    const q = enrollmentsQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.enrollments, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['fullName'],
      filter: (e) =>
        (!q.groupId || e.groupId === q.groupId) &&
        (!q.month || e.enrolledAt.slice(0, 7) === q.month),
      sortBy: 'enrolledAt',
      sortDir: 'desc',
    });
  },

  async getEnrollmentStats(year) {
    await simulateNetwork();
    const ofYear = db.enrollments.filter((e) => Number(e.enrolledAt.slice(0, 4)) === year);
    const points = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      count: ofYear.filter((e) => Number(e.enrolledAt.slice(5, 7)) === index + 1).length,
    }));
    return enrollmentStatsSchema.parse({ year, total: ofYear.length, points });
  },

  async getBranches(query) {
    const q = branchesQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.branches, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['name'],
    });
  },

  async getEmployees(query) {
    const q = employeesQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.employees, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['fullName'],
      filter: (e) => !q.position || e.position === q.position,
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
  },

  async getTimetable(query) {
    const q = timetableQuerySchema.parse(query ?? {});
    await simulateNetwork();
    const courseById = new Map(db.courses.map((c) => [c.id, c]));
    const lessons = db.groups
      // Завершённые группы в расписании не идут — занятий у них уже нет.
      .filter((g) => g.status !== 'finished')
      .filter(
        (g) =>
          (!q.branchId || g.branchId === q.branchId) &&
          (!q.mentorId || g.mentorId === q.mentorId) &&
          (!q.courseId || g.courseId === q.courseId),
      )
      .flatMap((g) => {
        const course = courseById.get(g.courseId);
        const [startTime, endTime] = (g.lessonTime ?? '').split('-').map((s) => s.trim());
        // Без курса, времени или дней занятий строку расписания не собрать.
        if (!course || !startTime || g.scheduleDays.length === 0) return [];
        return g.scheduleDays.map((weekday) => ({
          id: `${g.id}-${weekday}`,
          groupId: g.id,
          groupName: g.name,
          courseId: g.courseId,
          courseName: course.name,
          courseIcon: course.icon,
          mentorId: g.mentorId,
          mentorName: g.mentorName,
          branchId: g.branchId,
          weekday,
          startTime,
          endTime: endTime || undefined,
        }));
      });
    return timetableSchema.parse(lessons);
  },

  async getJournal(query) {
    const q = journalQuerySchema.parse(query);
    await simulateNetwork();
    const group = db.groups.find((g) => g.id === q.groupId);
    if (!group) throw new ApiError(404, `Группа ${q.groupId} не найдена`);
    const groupStudents = db.students.filter((s) => s.groups.some((g) => g.id === q.groupId));
    return journalSchema.parse(buildJournalData(group, groupStudents));
  },

  async getPayments(query) {
    const q = paymentsQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.payments, {
      page: q.page,
      pageSize: q.pageSize,
      filter: (p) =>
        (!q.studentId || p.studentId === q.studentId) && (!q.status || p.status === q.status),
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });
  },

  async getPaymentStats() {
    await simulateNetwork();
    const sumBy = (status: 'paid' | 'pending') =>
      db.payments.filter((p) => p.status === status).reduce((sum, p) => sum + p.amount, 0);
    return paymentStatsSchema.parse({
      collected: sumBy('paid'),
      pending: sumBy('pending'),
      count: db.payments.length,
    });
  },

  async getSmsTemplates() {
    await simulateNetwork();
    return smsTemplatesSchema.parse(db.smsTemplates);
  },

  async getSmsMailings(query) {
    const q = smsMailingsQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.smsMailings, {
      page: q.page,
      pageSize: q.pageSize,
      filter: (m) => !q.audience || m.audience === q.audience,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  },

  async getSmsAudienceCount(input) {
    const q = smsAudienceInputSchema.parse(input);
    await simulateNetwork();
    return smsAudienceCountSchema.parse({ count: smsAudienceCount(q.audience, q.groupId) });
  },

  async sendSms(dto) {
    const data = sendSmsDtoSchema.parse(dto);
    await simulateNetwork();
    const group = data.groupId ? db.groups.find((g) => g.id === data.groupId) : undefined;
    const mailing = smsMailingSchema.parse({
      id: crypto.randomUUID(),
      audience: data.audience,
      groupId: data.groupId,
      groupName: group?.name,
      recipientCount: smsAudienceCount(data.audience, data.groupId),
      text: data.text,
      status: 'sent',
      createdAt: new Date().toISOString(),
    });
    db.smsMailings.unshift(mailing);
    return mailing;
  },

  async getUsers(query) {
    const q = usersQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.accounts, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['fullName', 'phone'],
      filter: (u) => !q.role || u.role === q.role,
    });
  },

  async getLogs(query) {
    const q = logsQuerySchema.parse(query ?? {});
    await simulateNetwork();
    return queryList(db.logs, {
      page: q.page,
      pageSize: q.pageSize,
      search: q.search,
      searchFields: ['userName', 'target'],
      filter: (l) => !q.action || l.action === q.action,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  },
};
