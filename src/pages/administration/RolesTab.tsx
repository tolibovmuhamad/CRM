import { useTranslation } from 'react-i18next';
import type { Role } from '@/shared/api';
import { navItems } from '@/shared/config/navigation';

/** Роли в матрице (должностные chips из макета). */
const MATRIX_ROLES: Role[] = ['admin', 'manager', 'developer', 'mentor'];

/**
 * Вкладка «Роли» (макет Administration/Roles). Матрица «раздел × роль» строится
 * из конфига навигации `shared/config/navigation` — единственного источника
 * доступа. Это наше предложение, а не требование ТЗ; редактирование — по макету.
 */
export function RolesTab() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-bodySm text-ink-secondary">{t('admin.roles.note')}</p>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full border-collapse text-bodySm">
          <thead>
            <tr className="bg-surface-sunken text-ink-secondary">
              <th className="sticky left-0 z-10 bg-surface-sunken px-4 py-3 text-left font-medium">
                {t('admin.roles.section')}
              </th>
              {MATRIX_ROLES.map((role) => (
                <th key={role} className="px-3 py-3 text-center font-medium">
                  {t(`roles.${role}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {navItems.map((item) => (
              <tr key={item.to} className="border-t border-line">
                <td className="sticky left-0 z-10 whitespace-nowrap bg-surface-card px-4 py-2 text-label text-ink">
                  {t(item.labelKey)}
                </td>
                {MATRIX_ROLES.map((role) => {
                  // Пустой roles = раздел виден всем; иначе — только перечисленным.
                  const allowed = !item.roles || item.roles.includes(role);
                  return (
                    <td key={role} className="px-3 py-2 text-center">
                      {allowed ? (
                        <span className="text-label text-success-fg" aria-label={t('admin.roles.allowed')}>
                          ✓
                        </span>
                      ) : (
                        <span className="text-ink-muted" aria-label={t('admin.roles.denied')}>
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
