import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Moon, Sun, Zap, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';

function AuthArea() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
        <Button variant="primary" size="sm" asChild>
          <Link to="/register">Get started</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard">Dashboard</Link>
      </Button>
      <span className="hidden text-sm text-mist sm:inline">Hi, {user.name.split(' ')[0]}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await dispatch(logout());
          navigate('/');
        }}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-paper/70 backdrop-blur-md dark:bg-ink/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal text-white">
            <Zap className="h-4 w-4" aria-hidden="true" />
          </span>
          CareerFlow
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-mist transition-colors hover:bg-mist/10 dark:hover:bg-white/5"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <AuthArea />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto max-w-6xl px-6 text-sm text-mist">
        © {new Date().getFullYear()} CareerFlow. Built for IT students, by design.
      </div>
    </footer>
  );
}

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
