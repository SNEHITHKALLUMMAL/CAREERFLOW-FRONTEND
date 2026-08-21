import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-signal">404</p>
      <h1 className="mt-3 text-3xl font-semibold">This page didn&apos;t make the cut.</h1>
      <p className="mt-3 text-mist">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you
        back on track.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
