import { useNavigate, useParams } from 'react-router-dom';
import { useListing, useCreateListing, useUpdateListing } from '@/hooks/useListing';
import { LISTING_KINDS } from '@/config/listingKinds';
import { Card, CardTitle } from '@/components/ui/card';
import { ListingForm } from '@/components/dashboard/listings/ListingForm';

export function ListingFormPage({ kind }) {
  const config = LISTING_KINDS[kind];
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing, isLoading } = useListing(kind, id);
  const createMutation = useCreateListing(kind);
  const updateMutation = useUpdateListing(kind);

  if (isEdit && isLoading) return <p className="text-mist">Loading...</p>;

  const handleSubmit = async (payload) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate(config.routeBase);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardTitle>
          {isEdit
            ? `Edit ${config.label.toLowerCase()}`
            : `Post a new ${config.label.toLowerCase()}`}
        </CardTitle>
        <div className="mt-4">
          <ListingForm
            kind={kind}
            initialValues={isEdit ? existing : undefined}
            onSubmit={handleSubmit}
            submitLabel={isEdit ? 'Save changes' : 'Post listing'}
          />
        </div>
      </Card>
    </div>
  );
}
