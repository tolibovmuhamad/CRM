import type {
  BranchesQuery,
  CourseResourcesQuery,
  CoursesQuery,
  EmployeesQuery,
  EnrollmentsQuery,
  GraduatesQuery,
  GroupsQuery,
  JournalQuery,
  LogsQuery,
  PaymentsQuery,
  SmsAudienceInput,
  SmsMailingsQuery,
  StudentsQuery,
  TimetableQuery,
  UsersQuery,
} from './schemas';

/** Фабрики ключей TanStack Query. Единое место, чтобы инвалидация была предсказуемой. */
export const queryKeys = {
  session: ['session'] as const,
  students: {
    all: ['students'] as const,
    list: (query: StudentsQuery) => ['students', 'list', query] as const,
    detail: (id: string) => ['students', 'detail', id] as const,
  },
  groups: {
    all: ['groups'] as const,
    list: (query: GroupsQuery) => ['groups', 'list', query] as const,
    detail: (id: string) => ['groups', 'detail', id] as const,
  },
  courses: {
    all: ['courses'] as const,
    list: (query: CoursesQuery) => ['courses', 'list', query] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    resources: (query: CourseResourcesQuery) => ['courses', 'resources', query] as const,
  },
  graduates: {
    all: ['graduates'] as const,
    list: (query: GraduatesQuery) => ['graduates', 'list', query] as const,
    stats: ['graduates', 'stats'] as const,
  },
  enrollments: {
    all: ['enrollments'] as const,
    list: (query: EnrollmentsQuery) => ['enrollments', 'list', query] as const,
    stats: (year: number) => ['enrollments', 'stats', year] as const,
  },
  branches: {
    all: ['branches'] as const,
    list: (query: BranchesQuery) => ['branches', 'list', query] as const,
  },
  employees: {
    all: ['employees'] as const,
    list: (query: EmployeesQuery) => ['employees', 'list', query] as const,
  },
  timetable: {
    all: ['timetable'] as const,
    list: (query: TimetableQuery) => ['timetable', 'list', query] as const,
  },
  journal: {
    all: ['journal'] as const,
    detail: (query: JournalQuery) => ['journal', 'detail', query] as const,
  },
  payments: {
    all: ['payments'] as const,
    list: (query: PaymentsQuery) => ['payments', 'list', query] as const,
    stats: ['payments', 'stats'] as const,
  },
  sms: {
    all: ['sms'] as const,
    templates: ['sms', 'templates'] as const,
    mailings: (query: SmsMailingsQuery) => ['sms', 'mailings', query] as const,
    audienceCount: (input: SmsAudienceInput) => ['sms', 'audienceCount', input] as const,
  },
  users: {
    all: ['users'] as const,
    list: (query: UsersQuery) => ['users', 'list', query] as const,
  },
  logs: {
    all: ['logs'] as const,
    list: (query: LogsQuery) => ['logs', 'list', query] as const,
  },
} as const;
