import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useBookmarked } from '@/hooks/useListing';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

function BookmarkedSection({ kind, label, routeBase }) {
  const { data, isLoading } = useBookmarked(kind);

  if (isLoading) return null;
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium uppercase text-mist">{label}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Link key={item._id} to={`${routeBase}/${item._id}`}>
            <Card className="h-full transition-transform hover:-translate-y-1">
              <CardTitle>{item.title}</CardTitle>
              {item.location && <CardDescription>{item.location}</CardDescription>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SavedListingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
          <Bookmark className="h-6 w-6 text-signal" />
          Saved
        </h1>
        <p className="text-mist">Jobs and internships you&apos;ve bookmarked for later.</p>
      </div>

      <BookmarkedSection kind="job" label="Jobs" routeBase="/dashboard/jobs" />
      <BookmarkedSection kind="internship" label="Internships" routeBase="/dashboard/internships" />
    </div>
  );
}
