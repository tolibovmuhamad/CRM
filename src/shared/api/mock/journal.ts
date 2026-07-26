import { addDays, format, getDay } from 'date-fns';
import type { AttendanceStatus, Group, Student, Weekday } from '../schemas';

/** JS `getDay()` (0 = вс) → код дня недели. */
const WEEKDAY_BY_JS: Record<number, Weekday> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

/** Сколько занятий показываем в журнале. */
const LESSON_COUNT = 8;

/**
 * Даты первых N занятий группы: от `startDate` по её дням недели.
 * Детерминировано (не зависит от «сегодня») — журнал стабилен между запусками.
 */
export function buildLessonDates(group: Group, count = LESSON_COUNT): string[] {
  const days = new Set(group.scheduleDays);
  if (days.size === 0 || !group.startDate) return [];
  const end = group.endDate ? new Date(group.endDate) : null;
  const dates: string[] = [];
  let cursor = new Date(group.startDate);
  // Ограничиваем перебор, чтобы не зациклиться, если дни не совпадут.
  for (let i = 0; i < 400 && dates.length < count; i += 1) {
    if (end && cursor > end) break;
    if (days.has(WEEKDAY_BY_JS[getDay(cursor)])) {
      dates.push(format(cursor, 'yyyy-MM-dd'));
    }
    cursor = addDays(cursor, 1);
  }
  return dates;
}

/**
 * Детерминированная отметка по студенту и дате: ~70% был, ~15% опоздал, ~15% пропустил.
 * Одинаковая при каждом запросе — без «прыгающих» цифр в UI и тестах.
 */
function pseudoStatus(seed: string): AttendanceStatus {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  const r = sum % 100;
  if (r < 70) return 'present';
  if (r < 85) return 'late';
  return 'absent';
}

/** Собирает журнал посещаемости группы: студенты × даты занятий + счётчики. */
export function buildJournalData(group: Group, groupStudents: Student[]) {
  const dates = buildLessonDates(group);
  const students = groupStudents.map((s) => ({ id: s.id, fullName: s.fullName }));
  const entries: { studentId: string; date: string; status: AttendanceStatus }[] = [];
  const summary = { present: 0, late: 0, absent: 0 };

  for (const student of students) {
    for (const date of dates) {
      const status = pseudoStatus(`${student.id}:${date}`);
      entries.push({ studentId: student.id, date, status });
      summary[status] += 1;
    }
  }

  return { groupId: group.id, groupName: group.name, dates, students, entries, summary };
}
