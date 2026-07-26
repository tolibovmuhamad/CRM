import type { CrmApi } from '../types';
import { notImplemented } from '../errors';

/**
 * Заготовка HTTP-клиента. Реальный бэкенд пока не подключаем (ТЗ §12.1) —
 * методы бросают 501. Когда появится API, тело реализуется здесь, без правок
 * в компонентах: они ходят через `api` из `../index.ts`.
 */
export const httpApi: CrmApi = {
  login: () => notImplemented('login'),
  logout: () => notImplemented('logout'),
  getSession: () => notImplemented('getSession'),
  signup: () => notImplemented('signup'),
  getStudents: () => notImplemented('getStudents'),
  getStudent: () => notImplemented('getStudent'),
  createStudent: () => notImplemented('createStudent'),
  updateStudent: () => notImplemented('updateStudent'),
  deleteStudent: () => notImplemented('deleteStudent'),
  getGroups: () => notImplemented('getGroups'),
  getGroup: () => notImplemented('getGroup'),
  getCourses: () => notImplemented('getCourses'),
  getCourse: () => notImplemented('getCourse'),
  getCourseResources: () => notImplemented('getCourseResources'),
  getGraduates: () => notImplemented('getGraduates'),
  getGraduateStats: () => notImplemented('getGraduateStats'),
  getEnrollments: () => notImplemented('getEnrollments'),
  getEnrollmentStats: () => notImplemented('getEnrollmentStats'),
  getBranches: () => notImplemented('getBranches'),
  getEmployees: () => notImplemented('getEmployees'),
  getTimetable: () => notImplemented('getTimetable'),
  getJournal: () => notImplemented('getJournal'),
  getPayments: () => notImplemented('getPayments'),
  getPaymentStats: () => notImplemented('getPaymentStats'),
  getSmsTemplates: () => notImplemented('getSmsTemplates'),
  getSmsMailings: () => notImplemented('getSmsMailings'),
  getSmsAudienceCount: () => notImplemented('getSmsAudienceCount'),
  sendSms: () => notImplemented('sendSms'),
  getUsers: () => notImplemented('getUsers'),
  getLogs: () => notImplemented('getLogs'),
};
