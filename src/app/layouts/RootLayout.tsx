import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/widgets/sidebar';
import { Topbar } from '@/widgets/topbar';
import { BottomNav } from '@/widgets/bottom-nav';

/** Каркас приложения (этап 4): сайдбар + шапка + контент, на мобайле — нижняя навигация. */
export function RootLayout() {
  return (
    <div className="flex min-h-screen bg-surface-page">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 pb-24 md:pb-6">
          <div className="mx-auto max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
