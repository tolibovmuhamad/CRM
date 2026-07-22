import type { ReactNode } from 'react';

/** Ошибка уровня формы (не поля): показывается над полями и озвучивается скринридером. */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-md bg-danger-bg px-4 py-3 text-body text-danger-fg">
      {children}
    </p>
  );
}
