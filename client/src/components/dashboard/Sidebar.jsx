import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Sparkles,
  ClipboardList,
  ListChecks,
  Award,
  Briefcase,
  GraduationCap,
  FileText,
  Bookmark,
  Building2,
  Bell,
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  UserCog,
  ClipboardCheck,
  Users2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

// Only 'student', 'recruiter', 'placementOfficer', 'mentor', and 'superAdmin' have real
// destinations today — other roles' nav grows as their modules ship.
const NAV_BY_ROLE = {
  student: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/profile', label: 'My profile', icon: User },
    { to: '/dashboard/employability', label: 'Employability', icon: TrendingUp },
    { to: '/dashboard/ai-assistant', label: 'AI assistant', icon: Sparkles },
    { to: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
    { to: '/dashboard/results', label: 'My results', icon: ListChecks },
    { to: '/dashboard/certificates', label: 'Certificates', icon: Award },
    { to: '/dashboard/tasks', label: 'My tasks', icon: ClipboardCheck },
    { to: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/dashboard/internships', label: 'Internships', icon: GraduationCap },
    { to: '/dashboard/applications', label: 'My applications', icon: FileText },
    { to: '/dashboard/saved', label: 'Saved', icon: Bookmark },
    { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ],
  recruiter: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/company-profile', label: 'Company profile', icon: Building2 },
    { to: '/dashboard/my-jobs', label: 'My jobs', icon: Briefcase },
    { to: '/dashboard/my-internships', label: 'My internships', icon: GraduationCap },
    { to: '/dashboard/assigned-tasks', label: 'Assigned tasks', icon: ClipboardCheck },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ],
  mentor: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/assigned-tasks', label: 'Assigned tasks', icon: ClipboardCheck },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ],
  placementOfficer: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/student-analytics', label: 'Student analytics', icon: Users },
    { to: '/dashboard/career-analytics', label: 'Career analytics', icon: BarChart3 },
    { to: '/dashboard/recruiter-management', label: 'Recruiters', icon: Briefcase },
    { to: '/dashboard/mentor-assignment', label: 'Mentor assignment', icon: UserCog },
    { to: '/dashboard/drives', label: 'Drives', icon: Calendar },
    { to: '/dashboard/reports', label: 'Reports', icon: TrendingUp },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ],
  superAdmin: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/manage-users', label: 'Manage users', icon: Users2 },
    { to: '/dashboard/mentor-assignment', label: 'Mentor assignment', icon: UserCog },
    { to: '/dashboard/assigned-tasks', label: 'Assigned tasks', icon: ClipboardCheck },
    { to: '/dashboard/recruiter-management', label: 'Recruiters', icon: Briefcase },
    { to: '/dashboard/student-analytics', label: 'Students', icon: Users },
    { to: '/dashboard/career-analytics', label: 'Career analytics', icon: BarChart3 },
    { to: '/dashboard/reports', label: 'Reports', icon: TrendingUp },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ],
};

export function Sidebar() {
  const { user } = useAuth();
  const items = NAV_BY_ROLE[user?.role] || [];

  return (
    <nav className="space-y-1 p-4">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'bg-signal text-white' : 'text-mist hover:bg-mist/10 dark:hover:bg-white/5'
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
