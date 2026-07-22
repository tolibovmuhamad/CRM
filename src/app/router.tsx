import { createBrowserRouter } from 'react-router-dom';
import { GuestOnly } from './layouts/GuestOnly';
import { RequireAuth } from './layouts/RequireAuth';
import { RootLayout } from './layouts/RootLayout';
import { AuthPage } from '@/pages/auth';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { StudentFormPage } from '@/pages/students/StudentFormPage';
import { GraduatesPage } from '@/pages/graduates/GraduatesPage';
import { EnrollPage } from '@/pages/enroll/EnrollPage';
import { CourseResourcesPage } from '@/pages/courses/CourseResourcesPage';
import { CoursesPage } from '@/pages/courses/CoursesPage';
import { GroupsPage } from '@/pages/groups/GroupsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Роуты по разделам макета (docs/screens.md). Экраны входа и заявки — публичные,
 * всё остальное закрыто `RequireAuth` (этап 5). Разделы без своего экрана пока
 * показывают заглушку.
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
            { index: true, element: <PlaceholderPage titleKey="nav.dashboard" /> },
            { path: 'students', element: <StudentsPage /> },
            { path: 'students/new', element: <StudentFormPage mode="create" /> },
            { path: 'students/graduates', element: <GraduatesPage /> },
            { path: 'students/enroll', element: <EnrollPage /> },
            { path: 'students/:id/edit', element: <StudentFormPage mode="edit" /> },
            { path: 'groups', element: <GroupsPage /> },
            { path: 'courses', element: <CoursesPage /> },
            { path: 'courses/:id/resources', element: <CourseResourcesPage /> },
            { path: 'employees', element: <PlaceholderPage titleKey="nav.employees" /> },
            { path: 'journal', element: <PlaceholderPage titleKey="nav.journal" /> },
            { path: 'timetable', element: <PlaceholderPage titleKey="nav.timetable" /> },
            { path: 'accounting', element: <PlaceholderPage titleKey="nav.accounting" /> },
            { path: 'sms', element: <PlaceholderPage titleKey="nav.sms" /> },
            { path: 'administration', element: <PlaceholderPage titleKey="nav.administration" /> },
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
