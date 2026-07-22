import type { ResourceType } from '@/shared/api';
import {
  FileDocIcon,
  FileImageIcon,
  FilePdfIcon,
  FilePptIcon,
  FileVideoIcon,
  FileWordIcon,
  type IconProps,
} from '@/shared/ui/icons';

/** Иконка по типу файла — набор из макета Courses/Resources. */
const icons: Record<ResourceType, (p: IconProps) => JSX.Element> = {
  pdf: FilePdfIcon,
  image: FileImageIcon,
  ppt: FilePptIcon,
  word: FileWordIcon,
  doc: FileDocIcon,
  video: FileVideoIcon,
};

/** Цвет иконки по типу — из семантических токенов, не хардкод. */
const tones: Record<ResourceType, string> = {
  pdf: 'text-danger-fg',
  image: 'text-success-fg',
  ppt: 'text-warning-fg',
  word: 'text-info-fg',
  doc: 'text-ink-secondary',
  video: 'text-brand',
};

export interface ResourceTypeIconProps {
  type: ResourceType;
  size?: number;
}

export function ResourceTypeIcon({ type, size = 24 }: ResourceTypeIconProps) {
  const Icon = icons[type];
  return (
    <span className={tones[type]}>
      <Icon size={size} />
    </span>
  );
}
