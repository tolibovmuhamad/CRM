import { useEffect, type RefObject } from 'react';

/** Вызывает handler при клике вне элемента и при нажатии Esc. */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  active = true,
): void {
  useEffect(() => {
    if (!active) return;
    function onPointer(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (el && !el.contains(event.target as Node)) handler();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') handler();
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, handler, active]);
}
