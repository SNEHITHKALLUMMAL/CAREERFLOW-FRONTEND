import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useListings, useChangeListingStatus } from '@/hooks/useListing';
import { LISTING_KINDS } from '@/config/listingKinds';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';

const STATUS_STYLES = {
  open: 'bg-momentum-light text-momentum-dark dark:bg-momentum/15 dark:text-momentum',
  closed: 'bg-mist/10 text-mist',
  draft: 'bg-ember-light text-ember-dark dark:bg-ember/15 dark:text-ember',
};

export function RecruiterListingsPage({ kind }) {
  const config = LISTING_KINDS[kind];
  // Recruiters see all statuses of their own listings — pass no status filter, but the
  // backend already scopes non-students to createdBy via the shared listing service.
  const { data, isLoading } = useListings(kind, { recruiterId: undefined });
  const changeStatusMutation = useChangeListingStatus(kind);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            My {config.pluralLabel.toLowerCase()}
          </h1>
          <p className="text-mist">
            Manage the {config.pluralLabel.toLowerCase()} you&apos;ve posted.
          </p>
        </div>
        <Button asChild>
          <Link to={`${config.routeBase}/new`}>
            <Plus className="h-4 w-4" />
            Post {config.label.toLowerCase()}
          </Link>
        </Button>
      </div>

      {isLoading && <p className="text-mist">Loading...</p>}

      {!isLoading && data?.items.length === 0 && (
        <Card>
          <CardDescription>
            You haven&apos;t posted any {config.pluralLabel.toLowerCase()} yet.
          </CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {data?.items.map((item) => (
          <Card key={item._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-mist">{item.location || 'Location not set'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                    STATUS_STYLES[item.status]
                  )}
                >
                  {item.status}
                </span>
                <Select
                  value={item.status}
                  onChange={(e) =>
                    changeStatusMutation.mutate({ id: item._id, status: e.target.value })
                  }
                  className="h-9 w-28"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </Select>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              <Link
                to={`${config.routeBase}/${item._id}/edit`}
                className="text-sm font-medium text-signal hover:underline"
              >
                Edit
              </Link>
              <Link
                to={`${config.routeBase}/${item._id}/applicants`}
                className="flex items-center gap-1 text-sm font-medium text-signal hover:underline"
              >
                <Users className="h-3.5 w-3.5" />
                Applicants
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
