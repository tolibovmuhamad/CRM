import { createBrowserRouter } from 'react-router-dom';
import { GuestOnly } from './layouts/GuestOnly';
import { RequireAuth } from './layouts/RequireAuth';
import { RootLayout } from './layouts/RootLayout';
import { AuthPage } from '@/pages/auth';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { StudentFormPage } from '@/pages/students/StudentFormPage';
import { GraduatesPage } from '@/pages/graduates/GraduatesPage';
import { EnrollPage } from '@/pages/enroll/EnrollPage';
import { CourseResourcesPage } from '@/pages/courses/CourseResourcesPage';
import { CoursesPage } from '@/pages/courses/CoursesPage';
import { GroupsPage } from '@/pages/groups/GroupsPage';
import { EmployeesPage } from '@/pages/employees/EmployeesPage';
import { TimetablePage } from '@/pages/timetable/TimetablePage';
import { JournalPage } from '@/pages/journal/JournalPage';
import { PaymentsPage } from '@/pages/accounting/PaymentsPage';
import { SmsPage } from '@/pages/sms/SmsPage';
import { AdministrationPage } from '@/pages/administration/AdministrationPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Роуты по разделам макета (docs/screens.md). Экраны входа и заявки — публичные,
 * всё остальное закрыто `RequireAuth` (этап 5). Все разделы этапа 5 имеют свой экран.
 */
export const router = createBrowserRouter(
  [
    {
      element: <GuestOnly />,
      children: [
        { path: '/login', element: <AuthPage tab="login" /> },
        { path: '/signup', element: <AuthPage tab="signup" /> },
      ],
    },
    {
      element: <RequireAuth />,
      children: [
        {
          path: '/',
          element: <RootLayout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: 'students', element: <StudentsPage /> },
            { path: 'students/new', element: <StudentFormPage mode="create" /> },
            { path: 'students/graduates', element: <GraduatesPage /> },
            { path: 'students/enroll', element: <EnrollPage /> },
            { path: 'students/:id/edit', element: <StudentFormPage mode="edit" /> },
            { path: 'groups', element: <GroupsPage /> },
            { path: 'courses', element: <CoursesPage /> },
            { path: 'courses/:id/resources', element: <CourseResourcesPage /> },
            { path: 'employees', element: <EmployeesPage /> },
            { path: 'journal', element: <JournalPage /> },
            { path: 'timetable', element: <TimetablePage /> },
            { path: 'accounting', element: <PaymentsPage /> },
            { path: 'sms', element: <SmsPage /> },
            { path: 'administration', element: <AdministrationPage /> },
            { path: '*', element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
