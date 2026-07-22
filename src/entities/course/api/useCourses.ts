import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type CourseResourcesQuery, type CoursesQuery } from '@/shared/api';

/** Список курсов (макет Courses/Grid и Courses/List). */
export function useCourses(query: CoursesQuery = {}) {
  return useQuery({
    queryKey: queryKeys.courses.list(query),
    queryFn: () => api.getCourses(query),
    placeholderData: keepPreviousData,
  });
}

/** Курс по id. */
export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => api.getCourse(id),
    enabled: Boolean(id),
  });
}

/** Файлы-ресурсы курса (макет Courses/Resources). */
export function useCourseResources(query: CourseResourcesQuery = {}) {
  return useQuery({
    queryKey: queryKeys.courses.resources(query),
    queryFn: () => api.getCourseResources(query),
    placeholderData: keepPreviousData,
  });
}
