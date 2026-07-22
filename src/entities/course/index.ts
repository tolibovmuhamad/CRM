/** Публичный API сущности «курс». */
export { useCourses, useCourse, useCourseResources } from './api/useCourses';
export { CourseCard, type CourseCardProps } from './ui/CourseCard';
export { CourseIcon, type CourseIconProps } from './ui/CourseIcon';
export { ResourceTypeIcon, type ResourceTypeIconProps } from './ui/ResourceTypeIcon';
export type {
  Course,
  CoursesQuery,
  CourseIcon as CourseIconKey,
  CourseResource,
  CourseResourcesQuery,
  ResourceType,
} from '@/shared/api';
