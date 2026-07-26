import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  api,
  queryKeys,
  type SendSmsDto,
  type SmsAudienceInput,
  type SmsMailingsQuery,
} from '@/shared/api';

/** Шаблоны сообщений (макет Templates). */
export function useSmsTemplates() {
  return useQuery({ queryKey: queryKeys.sms.templates, queryFn: () => api.getSmsTemplates() });
}

/** История рассылок (макет SMS mailings). */
export function useSmsMailings(query: SmsMailingsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.sms.mailings(query),
    queryFn: () => api.getSmsMailings(query),
    placeholderData: keepPreviousData,
  });
}

/** Число получателей выбранной аудитории. */
export function useSmsAudienceCount(input: SmsAudienceInput) {
  return useQuery({
    queryKey: queryKeys.sms.audienceCount(input),
    queryFn: () => api.getSmsAudienceCount(input),
  });
}

/** Отправка рассылки. После успеха обновляет историю и счётчики. */
export function useSendSms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SendSmsDto) => api.sendSms(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sms.all });
    },
  });
}
