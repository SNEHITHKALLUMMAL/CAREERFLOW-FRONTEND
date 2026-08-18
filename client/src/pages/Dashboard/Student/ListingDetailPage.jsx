import { useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import {
  useListing,
  useToggleBookmark,
  useBookmarked,
  useApplyToListing,
} from '@/hooks/useListing';
import { useMyApplications } from '@/hooks/useApplications';
import { LISTING_KINDS } from '@/config/listingKinds';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ListingDetailPage({ kind }) {
  const config = LISTING_KINDS[kind];
  const { id } = useParams();
  const { data: item, isLoading } = useListing(kind, id);
  const { data: bookmarked } = useBookmarked(kind);
  const { data: myApplications } = useMyApplications();
  const toggleBookmark = useToggleBookmark(kind);
  const applyMutation = useApplyToListing(kind);

  if (isLoading || !item)
    return <p className="text-mist">Loading {config.label.toLowerCase()}...</p>;

  const isBookmarked = (bookmarked || []).some((b) => b._id === id);
  const existingApplication = myApplications?.find(
    (a) => a.targetType === kind && (a.targetId?._id === id || a.targetId === id)
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-light px-2.5 py-1 text-xs font-medium text-signal-dark dark:bg-signal/15 dark:text-signal">
              {kind === 'job' ? item.jobType : `${item.durationMonths || '—'} months`}
            </span>
            <CardTitle className="mt-3">{item.title}</CardTitle>
          </div>
          <button
            type="button"
            onClick={() => toggleBookmark.mutate({ id, bookmarked: isBookmarked })}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            className="shrink-0 text-mist hover:text-signal"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-signal" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-mist">
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {item.location}
              {item.isRemote ? ' · Remote' : ''}
            </span>
          )}
          {item.applicationDeadline && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Apply by {new Date(item.applicationDeadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <CardDescription className="mt-4 whitespace-pre-wrap">{item.description}</CardDescription>

        {item.requiredSkills?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Required skills</p>
            <p className="mt-1 text-sm text-mist">{item.requiredSkills.join(', ')}</p>
          </div>
        )}

        <div className="mt-6">
          {existingApplication ? (
            <p className="flex items-center gap-2 text-sm text-momentum">
              <CheckCircle2 className="h-4 w-4" />
              You&apos;ve applied — status: {existingApplication.status.replace('_', ' ')}
            </p>
          ) : (
            <Button
              size="lg"
              onClick={() => applyMutation.mutate(id)}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? 'Applying...' : 'Apply now'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
