import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  SmsStatusBadge,
  useSendSms,
  useSmsAudienceCount,
  useSmsMailings,
  useSmsTemplates,
  type SmsAudience,
  type SmsMailing,
} from '@/entities/sms';
import { api, queryKeys } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import {
  Badge,
  Button,
  Card,
  type Column,
  DataTable,
  Pagination,
  Select,
  Textarea,
  TableSkeleton,
} from '@/shared/ui';

const PAGE_SIZE = 8;
const AUDIENCES: SmsAudience[] = ['group', 'students', 'leads', 'graduates', 'mentors'];
const SMS_SEGMENT = 160;

/** SMS-рассылки (макет SMS mailings): композер по аудитории + шаблоны + история. */
export function SmsPage() {
  const { t, i18n } = useTranslation();

  const [audience, setAudience] = useState<SmsAudience>('students');
  const [groupId, setGroupId] = useState('');
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);

  const groups = useQuery({
    queryKey: queryKeys.groups.list({ pageSize: 100 }),
    queryFn: () => api.getGroups({ pageSize: 100 }),
  });
  const templates = useSmsTemplates();

  const audienceGroupId = audience === 'group' ? groupId || undefined : undefined;
  const audienceCount = useSmsAudienceCount({ audience, groupId: audienceGroupId });
  const recipients = audienceCount.data?.count ?? 0;

  const mailings = useSmsMailings({ page, pageSize: PAGE_SIZE });
  const sendSms = useSendSms();

  const chars = text.trim().length;
  const segments = Math.max(1, Math.ceil(chars / SMS_SEGMENT));
  const groupMissing = audience === 'group' && !groupId;
  const canSend = chars > 0 && recipients > 0 && !groupMissing && !sendSms.isPending;

  function submit() {
    if (!canSend) return;
    sendSms.mutate(
      { audience, groupId: audienceGroupId, text: text.trim() },
      { onSuccess: () => setText('') },
    );
  }

  function applyTemplate(id: string) {
    const template = templates.data?.find((tpl) => tpl.id === id);
    if (template) setText(template.text);
  }

  const items = mailings.data?.items ?? [];

  const audienceLabel = (m: SmsMailing) =>
    m.audience === 'group' && m.groupName ? m.groupName : t(`sms.audience.${m.audience}`);

  const columns: Column<SmsMailing>[] = [
    {
      key: 'audience',
      header: t('sms.columns.audience'),
      render: (m) => <Badge tone="neutral">{audienceLabel(m)}</Badge>,
    },
    {
      key: 'recipients',
      header: t('sms.columns.recipients'),
      render: (m) => <Badge tone="brand">{m.recipientCount}</Badge>,
    },
    {
      key: 'text',
      header: t('sms.columns.text'),
      render: (m) => (
        <span className="block max-w-md truncate text-ink-secondary">{m.text}</span>
      ),
    },
    {
      key: 'date',
      header: t('sms.columns.date'),
      render: (m) => (
        <span className="whitespace-nowrap text-ink-secondary">
          {formatDate(m.createdAt, i18n.language)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('sms.columns.status'),
      render: (m) => <SmsStatusBadge status={m.status} />,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-h3 text-ink">{t('sms.title')}</h1>

      <Card className="flex flex-col gap-4 p-5">
        <h2 className="text-h5 text-ink">{t('sms.compose')}</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:max-w-xl">
          <Select
            selectSize="lg"
            value={audience}
            onChange={(e) => setAudience(e.target.value as SmsAudience)}
            aria-label={t('sms.audience.label')}
          >
            {AUDIENCES.map((value) => (
              <option key={value} value={value}>
                {t(`sms.audience.${value}`)}
              </option>
            ))}
          </Select>

          {audience === 'group' && (
            <Select
              selectSize="lg"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              aria-label={t('sms.audience.group')}
            >
              <option value="">{t('sms.chooseGroup')}</option>
              {groups.data?.items.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        <p className="text-bodySm text-ink-secondary">
          {t('sms.recipients', { count: recipients })}
        </p>

        <Select
          selectSize="lg"
          className="sm:max-w-xs"
          value=""
          onChange={(e) => applyTemplate(e.target.value)}
          aria-label={t('sms.insertTemplate')}
        >
          <option value="">{t('sms.insertTemplate')}</option>
          {templates.data?.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </Select>

        <Textarea
          label={t('sms.message')}
          placeholder={t('sms.messagePlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={500}
          hint={t('sms.counter', { chars, sms: segments })}
        />

        {recipients === 0 && !groupMissing && (
          <p className="text-bodySm text-warning-fg">{t('sms.noRecipients')}</p>
        )}
        {sendSms.isError && <p className="text-bodySm text-danger-fg">{t('sms.sendError')}</p>}
        {sendSms.isSuccess && (
          <p className="text-bodySm text-success-fg">
            {t('sms.sent', { count: sendSms.data.recipientCount })}
          </p>
        )}

        <div className="flex justify-end">
          <Button onClick={submit} disabled={!canSend}>
            {sendSms.isPending ? t('sms.sending') : t('sms.send')}
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-h5 text-ink">{t('sms.history')}</h2>

        {mailings.isPending ? (
          <Card>
            <TableSkeleton rows={5} columns={5} />
          </Card>
        ) : mailings.isError ? (
          <Card className="flex flex-col items-start gap-3 p-6">
            <p className="text-body text-danger-fg">{t('sms.loadError')}</p>
            <Button variant="secondaryOutline" onClick={() => void mailings.refetch()}>
              {t('common.retry')}
            </Button>
          </Card>
        ) : items.length === 0 ? (
          <Card className="flex flex-col items-start gap-3 p-8">
            <p className="text-h5 text-ink">{t('sms.empty')}</p>
            <p className="text-body text-ink-secondary">{t('sms.emptyHint')}</p>
          </Card>
        ) : (
          <Card className={mailings.isFetching ? 'opacity-60 transition-opacity' : undefined}>
            <DataTable columns={columns} rows={items} getRowKey={(m) => m.id} />
          </Card>
        )}

        {mailings.data && (
          <Pagination
            page={mailings.data.page}
            pageSize={mailings.data.pageSize}
            total={mailings.data.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  );
}
