import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ForgotPasswordModal, LoginForm, SignupForm } from '@/features/auth';
import { LanguageSwitcher } from '@/features/language-switcher/LanguageSwitcher';
import { Card, Logo, Tabs } from '@/shared/ui';
import { AuthBanner } from './AuthBanner';
import { SignupSuccess } from './SignupSuccess';

export type AuthTab = 'login' | 'signup';

export interface AuthPageProps {
  /** Какая вкладка открыта: за это отвечает роут (/login или /signup). */
  tab: AuthTab;
}

/**
 * Экран входа и заявки на обучение (макет Log in / Sign up). Обе формы живут на
 * одном экране, вкладки переключают роут — чтобы на них можно было дать ссылку.
 */
export function AuthPage({ tab }: AuthPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [signedUpName, setSignedUpName] = useState<string | null>(null);

  /** Куда пользователя не пустили без входа — туда и возвращаем (см. RequireAuth). */
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between gap-4">
            <Logo height={40} />
            <LanguageSwitcher />
          </header>

          <div className="flex flex-1 items-center justify-center py-8">
            <Card radius="md" className="w-full max-w-lg p-6 sm:p-8">
              {signedUpName ? (
                <SignupSuccess
                  fullName={signedUpName}
                  onBackToLogin={() => {
                    setSignedUpName(null);
                    navigate('/login');
                  }}
                />
              ) : (
                <>
                  <Tabs
                    fullWidth
                    aria-label={t('auth.tabsAria')}
                    value={tab}
                    onChange={(id) => navigate(id === 'signup' ? '/signup' : '/login')}
                    tabs={[
                      { id: 'login', label: t('auth.logIn') },
                      { id: 'signup', label: t('auth.signUp') },
                    ]}
                  />

                  <div className="pt-6">
                    {tab === 'login' ? (
                      <LoginForm
                        onSuccess={() => navigate(from, { replace: true })}
                        onForgotPassword={() => setForgotOpen(true)}
                      />
                    ) : (
                      <SignupForm onSuccess={setSignedUpName} />
                    )}
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>

        <div className="lg:w-[55%]">
          <AuthBanner />
        </div>
      </div>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
