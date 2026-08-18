import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Bookmark, BookmarkCheck } from 'lucide-react';
import { useListings, useToggleBookmark, useBookmarked } from '@/hooks/useListing';
import { LISTING_KINDS } from '@/config/listingKinds';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function ListingListPage({ kind }) {
  const config = LISTING_KINDS[kind];
  const [search, setSearch] = useState('');
  const { data, isLoading } = useListings(kind, { search: search || undefined });
  const { data: bookmarked } = useBookmarked(kind);
  const toggleBookmark = useToggleBookmark(kind);

  const bookmarkedIds = new Set((bookmarked || []).map((item) => item._id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{config.pluralLabel}</h1>
          <p className="text-mist">Browse open opportunities and apply directly.</p>
        </div>
        <Input
          placeholder="Search by title, skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {isLoading && <p className="text-mist">Loading {config.pluralLabel.toLowerCase()}...</p>}

      {!isLoading && data?.items.length === 0 && (
        <Card>
          <CardDescription>
            No {config.pluralLabel.toLowerCase()} match right now. Check back soon.
          </CardDescription>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((item) => {
          const isBookmarked = bookmarkedIds.has(item._id);
          return (
            <Card key={item._id} className="relative h-full">
              <button
                type="button"
                onClick={() => toggleBookmark.mutate({ id: item._id, bookmarked: isBookmarked })}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                className="absolute right-4 top-4 text-mist hover:text-signal"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-signal" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>

              <Link to={`${config.routeBase}/${item._id}`}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-light px-2.5 py-1 text-xs font-medium text-signal-dark dark:bg-signal/15 dark:text-signal">
                  <Briefcase className="h-3.5 w-3.5" />
                  {kind === 'job' ? item.jobType : `${item.durationMonths || '—'} months`}
                </span>
                <CardTitle className="mt-3 pr-6">{item.title}</CardTitle>
                {item.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-mist">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                    {item.isRemote ? ' · Remote' : ''}
                  </p>
                )}
                {item.requiredSkills?.length > 0 && (
                  <p className="mt-2 text-xs text-mist">
                    {item.requiredSkills.slice(0, 4).join(', ')}
                  </p>
                )}
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
