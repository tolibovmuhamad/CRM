import { z } from 'zod';
import { idSchema, isoDateSchema } from './common';

/** Отметка посещения (макет: сводка Present / Absent / Late). */
export const attendanceStatusSchema = z.enum(['present', 'late', 'absent']);
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;

/** Одна ячейка журнала: студент был/опоздал/отсутствовал на занятии определённой даты. */
export const journalEntrySchema = z.object({
  studentId: idSchema,
  date: isoDateSchema,
  status: attendanceStatusSchema,
});
export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const journalStudentSchema = z.object({
  id: idSchema,
  fullName: z.string().min(1),
});
export type JournalStudent = z.infer<typeof journalStudentSchema>;

/** Счётчики посещаемости группы (плитки над журналом). */
export const attendanceSummarySchema = z.object({
  present: z.number().int().nonnegative(),
  late: z.number().int().nonnegative(),
  absent: z.number().int().nonnegative(),
});
export type AttendanceSummary = z.infer<typeof attendanceSummarySchema>;

/**
 * Журнал посещаемости группы: список студентов × даты занятий и отметки в ячейках.
 * Даты занятий выводятся из расписания группы (дни недели от даты старта).
 * Оценки (Progressbook) появятся вместе с макетом компонента `Week`.
 */
export const journalSchema = z.object({
  groupId: idSchema,
  groupName: z.string().min(1),
  dates: z.array(isoDateSchema),
  students: z.array(journalStudentSchema),
  entries: z.array(journalEntrySchema),
  summary: attendanceSummarySchema,
});
export type Journal = z.infer<typeof journalSchema>;

export const journalQuerySchema = z.object({
  groupId: idSchema,
});
export type JournalQuery = z.input<typeof journalQuerySchema>;
