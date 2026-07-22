import { differenceInYears } from 'date-fns';

/** Полных лет на сегодня. `undefined`, если даты рождения нет или она битая. */
export function calcAge(birthDate: string | undefined): number | undefined {
  if (!birthDate) return undefined;
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return undefined;
  const years = differenceInYears(new Date(), date);
  return years >= 0 ? years : undefined;
}
