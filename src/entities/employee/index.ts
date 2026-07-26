/** Публичный API сущности «сотрудник». */
export { useEmployees } from './api/useEmployees';
export { EmployeeCard, type EmployeeCardProps } from './ui/EmployeeCard';
export { EmployeeAvatar, type EmployeeAvatarProps } from './ui/EmployeeAvatar';
export { PositionBadge, type PositionBadgeProps } from './ui/PositionBadge';
export type { Employee, EmployeesQuery, Position } from '@/shared/api';
