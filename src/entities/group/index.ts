/** Публичный API сущности «группа». */
export { useGroups, useGroup } from './api/useGroups';
export { GroupCard, type GroupCardProps } from './ui/GroupCard';
export { GroupStatusBadge } from './ui/GroupStatusBadge';
export type { Group, GroupsQuery, GroupStatus, Weekday } from '@/shared/api';
