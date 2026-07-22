import type { ReactNode, SVGProps } from 'react';

/** Иконки интерфейса. Штриховые, 24×24, наследуют цвет через currentColor. */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Base({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />
  </Base>
);
export const UsersIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
  </Base>
);
export const GroupsIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Base>
);
export const CoursesIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 0-2 2V5ZM17 3h1a2 2 0 0 1 2 2v16" />
  </Base>
);
export const EmployeesIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Base>
);
export const JournalIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 3h9a2 2 0 0 1 2 2v16H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM6 21a2 2 0 0 1-2-2V5M10 8h5M10 12h5" />
  </Base>
);
export const TimetableIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </Base>
);
export const AccountingIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7ZM16 12h.01M3 10h18" />
  </Base>
);
export const SmsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
  </Base>
);
export const AdminIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z" />
  </Base>
);
export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Base>
);
export const BellIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </Base>
);
export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m15 6-6 6 6 6" />
  </Base>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);
export const UserIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </Base>
);
export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
);
export const PlusIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const EyeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Base>
);
export const EyeOffIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M10.6 6.2A9.9 9.9 0 0 1 12 5c6.4 0 10 7 10 7a17.7 17.7 0 0 1-3.2 4.2M6.6 6.7A17.5 17.5 0 0 0 2 12s3.6 7 10 7a9.8 9.8 0 0 0 4.6-1.1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </Base>
);
export const LogoutIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Base>
);
export const ChevronRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
);
export const GridViewIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Base>
);
export const ListViewIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
  </Base>
);
/** square-edit-outline из макета — правка строки/карточки. */
export const EditIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" />
    <path d="M18.4 2.6a2 2 0 0 1 2.8 2.83L12 14.6l-3.5.9.9-3.5 9-9.4Z" />
  </Base>
);
export const DeleteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </Base>
);
/** Корона у премиум-студента (в макете — жёлтая, заливкой). */
export const CrownIcon = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M3 8.5 6.5 12 12 5l5.5 7L21 8.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5Z" />
  </Base>
);
export const NoteIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </Base>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Base>
);
export const DownloadIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v12M7 11l5 5 5-5M4 21h16" />
  </Base>
);

/**
 * Иконки типов файлов для ресурсов курса. Набор взят из макета
 * (`material-symbols:picture-as-pdf-rounded`, `mdi:file-image`,
 * `mdi:file-powerpoint`, `mdi:file-word`, `mdi:file-document`, `mdi:file-video`)
 * и перерисован в общем штриховом стиле остальных иконок проекта.
 */
function FileBase({ children, ...props }: IconProps & { children?: ReactNode }) {
  return (
    <Base {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      {children}
    </Base>
  );
}
export const FilePdfIcon = (p: IconProps) => (
  <FileBase {...p}>
    <path d="M8.5 17v-3.5h1a1 1 0 0 1 0 2h-1M13 17v-3.5M13 13.5h1.5" />
  </FileBase>
);
export const FileImageIcon = (p: IconProps) => (
  <FileBase {...p}>
    <circle cx="10" cy="13.5" r="1" />
    <path d="M8 18l2.5-2.5L15 18" />
  </FileBase>
);
export const FilePptIcon = (p: IconProps) => (
  <FileBase {...p}>
    <path d="M9 18v-4.5h1.5a1.25 1.25 0 0 1 0 2.5H9" />
  </FileBase>
);
export const FileWordIcon = (p: IconProps) => (
  <FileBase {...p}>
    <path d="M8 13.5l1.25 4.5L10.5 15l1.25 3 1.25-4.5" />
  </FileBase>
);
export const FileDocIcon = (p: IconProps) => (
  <FileBase {...p}>
    <path d="M8.5 14h7M8.5 17h4" />
  </FileBase>
);
export const FileVideoIcon = (p: IconProps) => (
  <FileBase {...p}>
    <path d="M9.5 13.5v4l4-2-4-2Z" />
  </FileBase>
);
