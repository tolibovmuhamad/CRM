import { z } from 'zod';
import { idSchema, weekdaySchema } from './common';
import { courseIconSchema } from './course';

/**
 * Занятие недельной сетки расписания (макет Time table). Разворачивается из
 * групп: у группы есть дни занятий и время, поэтому отдельной сущности «урок»
 * пока не заводим — расписание собирается на лету из активных групп.
 */
export const timetableLessonSchema = z.object({
  id: idSchema,
  groupId: idSchema,
  groupName: z.string().min(1),
  courseId: idSchema,
  courseName: z.string().min(1),
  courseIcon: courseIconSchema,
  mentorId: idSchema.optional(),
  mentorName: z.string().optional(),
  branchId: idSchema.optional(),
  weekday: weekdaySchema,
  /** Начало занятия, «18:00». */
  startTime: z.string().min(1),
  /** Конец занятия, «20:00». Может отсутствовать, если задано только начало. */
  endTime: z.string().optional(),
});
export type TimetableLesson = z.infer<typeof timetableLessonSchema>;

/** Ответ расписания — плоский список занятий на неделю (не пагинируется). */
export const timetableSchema = z.array(timetableLessonSchema);

export const timetableQuerySchema = z.object({
  branchId: idSchema.optional(),
  mentorId: idSchema.optional(),
  courseId: idSchema.optional(),
});
export type TimetableQuery = z.input<typeof timetableQuerySchema>;
