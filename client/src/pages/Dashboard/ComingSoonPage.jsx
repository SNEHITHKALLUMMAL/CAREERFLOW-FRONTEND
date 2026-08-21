import { Card, CardTitle, CardDescription } from '@/components/ui/card';

const ROLE_LABEL = {
  recruiter: 'Recruiter',
  mentor: 'Mentor',
  placementOfficer: 'Placement Officer',
  collegeAdmin: 'College Admin',
  superAdmin: 'Super Admin',
};

export function ComingSoonPage({ role }) {
  const label = ROLE_LABEL[role] || role;

  return (
    <Card className="mx-auto max-w-md text-center">
      <CardTitle>{label} dashboard</CardTitle>
      <CardDescription className="mt-2">
        This dashboard is being built in a later phase of the project. Your account works — the{' '}
        {label.toLowerCase()} tools are on the way.
      </CardDescription>
    </Card>
  );
}
