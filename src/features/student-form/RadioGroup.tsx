import { useId } from 'react';
import { cn } from '@/shared/lib/cn';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  label: string;
  name: string;
  value: string | undefined;
  options: RadioOption[];
  onChange: (value: string) => void;
}

/**
 * Пара радиокнопок в рамке (макет: Status — Active/Inactive, Gender — Male/Female).
 * Настоящие `input[type=radio]`, чтобы работали стрелки и скринридер.
 */
export function RadioGroup({ label, name, value, options, onChange }: RadioGroupProps) {
  const groupId = useId();

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-labelSm text-ink-secondary" id={groupId}>
        {label}
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex h-14 flex-1 cursor-pointer items-center gap-2 rounded-md border px-4 text-body transition-colors focus-within:ring-2 focus-within:ring-brand',
                checked
                  ? 'border-brand text-ink'
                  : 'border-line text-ink-secondary hover:bg-surface-hover',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 accent-brand"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
