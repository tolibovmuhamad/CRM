import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  api,
  queryKeys,
  type CreateStudentDto,
  type StudentsQuery,
  type UpdateStudentDto,
} from '@/shared/api';

/**
 * Список студентов (ТЗ §6). Данные идут через `api`, компонент не знает про mock/http.
 *
 * `keepPreviousData`: при смене фильтра или страницы список не схлопывается в
 * скелет, а остаётся на месте приглушённым — иначе экран прыгает на каждую букву.
 */
export function useStudents(query: StudentsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.students.list(query),
    queryFn: () => api.getStudents(query),
    placeholderData: keepPreviousData,
  });
}

/** Карточка студента по id. */
export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => api.getStudent(id),
    enabled: Boolean(id),
  });
}

/** Создание студента с инвалидацией списков (референс мутации для этапа 5). */
export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateStudentDto) => api.createStudent(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.students.all }),
  });
}

/** Правка студента (форма Edit profile). */
export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateStudentDto }) => api.updateStudent(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.students.all }),
  });
}

/** Удаление студента (действие delete в строке таблицы). */
export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.students.all }),
  });
}
