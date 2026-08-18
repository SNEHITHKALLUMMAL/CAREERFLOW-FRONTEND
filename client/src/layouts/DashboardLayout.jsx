import { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Zap } from 'lucide-react';
import { closeSidebar } from '@/redux/slices/uiSlice';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { cn } from '@/utils/cn';

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
    </div>
  );
}

export function DashboardLayout() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 border-r border-mist/10 bg-paper transition-transform',
          'dark:border-white/10 dark:bg-ink lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Link
          to="/"
          className="flex h-16 items-center gap-2 px-4 font-display text-lg font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal text-white">
            <Zap className="h-4 w-4" aria-hidden="true" />
          </span>
          CareerFlow
        </Link>
        <Sidebar />
      </aside>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      <div className="lg:pl-64">
        <Topbar />
        <main className="p-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
