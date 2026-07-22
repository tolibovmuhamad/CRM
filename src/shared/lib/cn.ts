export type ClassValue = string | number | false | null | undefined;

/** Склейка классов Tailwind: отбрасывает falsy. Мини-замена clsx без зависимости. */
export function cn(...parts: ClassValue[]): string {
  return parts.filter((p): p is string | number => Boolean(p)).join(' ');
}
