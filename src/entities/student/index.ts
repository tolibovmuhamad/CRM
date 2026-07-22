/** Публичный API сущности «студент». */
export {
  useStudents,
  useStudent,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from './api/useStudents';
export { StudentCard, type StudentCardProps } from './ui/StudentCard';
export { StudentName, type StudentNameProps } from './ui/StudentName';
export { StudentPhone } from './ui/StudentPhone';
export { StudentStatusBadge, ContractBadge } from './ui/StudentBadges';
export { calcAge } from './lib/age';
export type {
  Student,
  StudentStatus,
  ContractStatus,
  StudentsQuery,
  CreateStudentDto,
  UpdateStudentDto,
  StudentGroupRef,
  Gender,
} from '@/shared/api';
