import { useAuth } from '@/hooks/useAuth';
import { StudentOverviewPage } from './Student/StudentOverviewPage';
import { RecruiterOverviewPage } from './Recruiter/RecruiterOverviewPage';
import { PlacementOverviewPage } from './Placement/PlacementOverviewPage';
import { MentorOverviewPage } from './Mentor/MentorOverviewPage';
import { ComingSoonPage } from './ComingSoonPage';

export function DashboardHome() {
  const { user } = useAuth();

  if (user.role === 'student') return <StudentOverviewPage />;
  if (user.role === 'recruiter') return <RecruiterOverviewPage />;
  if (user.role === 'placementOfficer') return <PlacementOverviewPage />;
  if (user.role === 'mentor') return <MentorOverviewPage />;
  return <ComingSoonPage role={user.role} />;
}
