import { z } from 'zod';
import {
  authUserSchema,
  branchSchema,
  courseResourceSchema,
  courseSchema,
  enrollmentSchema,
  graduateSchema,
  employeeSchema,
  groupSchema,
  paymentSchema,
  type SignupRequest,
  studentSchema,
} from '../schemas';
import { demoAccountsFixture } from '@/mocks/fixtures/accounts';
import { branchesFixture } from '@/mocks/fixtures/branches';
import { enrollmentsFixture } from '@/mocks/fixtures/enrollments';
import { graduatesFixture } from '@/mocks/fixtures/graduates';
import { coursesFixture } from '@/mocks/fixtures/courses';
import { employeesFixture } from '@/mocks/fixtures/employees';
import { groupsFixture } from '@/mocks/fixtures/groups';
import { resourcesFixture } from '@/mocks/fixtures/resources';
import { paymentsFixture } from '@/mocks/fixtures/payments';
import { studentsFixture } from '@/mocks/fixtures/students';

/**
 * Мок-хранилище. Фикстуры прогоняются через схемы при загрузке — так дрейф
 * данных ловится сразу (ТЗ §6: схема — единственный источник истины).
 */
export const db = {
  students: z.array(studentSchema).parse(studentsFixture),
  groups: z.array(groupSchema).parse(groupsFixture),
  courses: z.array(courseSchema).parse(coursesFixture),
  resources: z.array(courseResourceSchema).parse(resourcesFixture),
  employees: z.array(employeeSchema).parse(employeesFixture),
  payments: z.array(paymentSchema).parse(paymentsFixture),
  branches: z.array(branchSchema).parse(branchesFixture),
  graduates: z.array(graduateSchema).parse(graduatesFixture),
  enrollments: z.array(enrollmentSchema).parse(enrollmentsFixture),
  accounts: z.array(authUserSchema).parse(demoAccountsFixture),
  /** Заявки с экрана Sign up — накапливаются за время сессии страницы. */
  signupRequests: [] as SignupRequest[],
};
