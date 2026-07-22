import type { CreateStudentDto, Student } from '@/shared/api';

/**
 * Значения формы из студента. Все поля — строки, включая необязательные: RHF не
 * любит переключение input между undefined и значением (поле становится
 * неуправляемым и React ругается в консоли).
 *
 * `birthDate` режем до `YYYY-MM-DD` — этого ждёт `<input type="date">`.
 */
export function toFormValues(student?: Student): CreateStudentDto {
  return {
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    birthDate: student?.birthDate?.slice(0, 10) ?? '',
    gender: student?.gender,
    address: student?.address ?? '',
    email: student?.email ?? '',
    status: student?.status === 'no_active' ? 'no_active' : 'active',
    phone: student?.phone ?? '',
    phones:
      student?.phones.map((p) => ({ value: p.value, description: p.description ?? '' })) ?? [],
    branchId: student?.branchId ?? '',
    telegramUsername: student?.telegramUsername ?? '',
    notes: student?.notes ?? '',
    avatarUrl: student?.avatarUrl ?? '',
  };
}
