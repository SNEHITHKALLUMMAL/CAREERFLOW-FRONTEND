import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut, Bell } from 'lucide-react';
import { toggleSidebar } from '@/redux/slices/uiSlice';
import { logout } from '@/redux/slices/authSlice';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useMyNotifications } from '@/hooks/useNotifications';

function roleLabel(role) {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/([A-Z])/g, ' $1');
}

export function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { data: notifications } = useMyNotifications({ unreadOnly: true });
  const unreadCount = notifications?.length || 0;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-mist/10 bg-paper/80 px-6 backdrop-blur-md dark:border-white/10 dark:bg-ink/80">
      <button
        type="button"
        aria-label="Toggle navigation"
        className="rounded-lg p-2 text-mist hover:bg-mist/10 dark:hover:bg-white/5 lg:hidden"
        onClick={() => dispatch(toggleSidebar())}
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="hidden text-sm text-mist lg:block">{roleLabel(user?.role)} dashboard</span>

      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/notifications"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          className="relative rounded-xl p-2 text-mist hover:bg-mist/10 dark:hover:bg-white/5"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-xl p-2 text-mist hover:bg-mist/10 dark:hover:bg-white/5"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={async () => {
            await dispatch(logout());
            navigate('/');
          }}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-mist hover:bg-mist/10 dark:hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
