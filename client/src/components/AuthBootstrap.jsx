import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bootstrapSession } from '@/redux/slices/authSlice';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-ink">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
    </div>
  );
}

/** Wrap the router with this so a returning visitor's session is restored before any route renders. */
export function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    dispatch(bootstrapSession()).finally(() => setChecked(true));
  }, [dispatch]);

  if (!checked) return <LoadingScreen />;
  return children;
}
