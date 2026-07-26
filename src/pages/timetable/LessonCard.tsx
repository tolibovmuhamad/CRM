import { courseColor } from '@/entities/course';
import type { TimetableLesson } from '@/entities/timetable';
import { Card } from '@/shared/ui';

export interface LessonCardProps {
  lesson: TimetableLesson;
}

/**
 * Ячейка расписания: время, группа, курс и ментор. Слева — цветная метка курса
 * (цвет из палитры `tokens.chart.categorical`, общий с кружком курса).
 */
export function LessonCard({ lesson }: LessonCardProps) {
  const color = courseColor(lesson.courseIcon);

  return (
    <Card
      className="flex flex-col gap-1 border-l-4 p-3"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-labelSm text-ink">
          {lesson.startTime}
          {lesson.endTime ? `–${lesson.endTime}` : ''}
        </span>
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
      <span className="truncate text-label text-ink">{lesson.groupName}</span>
      <span className="truncate text-bodySm text-ink-secondary">{lesson.courseName}</span>
      {lesson.mentorName && (
        <span className="truncate text-bodySm text-ink-muted">{lesson.mentorName}</span>
      )}
    </Card>
  );
}
