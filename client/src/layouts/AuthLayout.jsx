import { Link, Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function AuthLayout() {
  return (
    <div className="mesh-backdrop relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal text-white">
            <Zap className="h-4 w-4" aria-hidden="true" />
          </span>
          CareerFlow
        </Link>

        <Card className="w-full">
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
