import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { HomePage } from '@/pages/Home/HomePage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/Auth/ResetPasswordPage';

// Every dashboard page is lazy-loaded — these are only ever reached behind
// ProtectedRoute, and DashboardLayout wraps its <Outlet /> in a single Suspense
// boundary, so this is the one place code-splitting meaningfully shrinks the initial
// bundle (Chart.js alone was a significant chunk of it) without adding boilerplate
// per page.
const DashboardHome = lazy(() =>
  import('@/pages/Dashboard/DashboardHome').then((m) => ({ default: m.DashboardHome }))
);
const StudentProfilePage = lazy(() =>
  import('@/pages/Dashboard/Student/StudentProfilePage').then((m) => ({
    default: m.StudentProfilePage,
  }))
);
const AIAssistantPage = lazy(() =>
  import('@/pages/Dashboard/Student/AIAssistantPage').then((m) => ({ default: m.AIAssistantPage }))
);
const AssessmentListPage = lazy(() =>
  import('@/pages/Dashboard/Student/AssessmentListPage').then((m) => ({
    default: m.AssessmentListPage,
  }))
);
const AssessmentDetailPage = lazy(() =>
  import('@/pages/Dashboard/Student/AssessmentDetailPage').then((m) => ({
    default: m.AssessmentDetailPage,
  }))
);
const AssessmentTakePage = lazy(() =>
  import('@/pages/Dashboard/Student/AssessmentTakePage').then((m) => ({
    default: m.AssessmentTakePage,
  }))
);
const AssessmentResultPage = lazy(() =>
  import('@/pages/Dashboard/Student/AssessmentResultPage').then((m) => ({
    default: m.AssessmentResultPage,
  }))
);
const AssessmentLeaderboardPage = lazy(() =>
  import('@/pages/Dashboard/Student/AssessmentLeaderboardPage').then((m) => ({
    default: m.AssessmentLeaderboardPage,
  }))
);
const MyResultsPage = lazy(() =>
  import('@/pages/Dashboard/Student/MyResultsPage').then((m) => ({ default: m.MyResultsPage }))
);
const MyCertificatesPage = lazy(() =>
  import('@/pages/Dashboard/Student/MyCertificatesPage').then((m) => ({
    default: m.MyCertificatesPage,
  }))
);
const ListingListPage = lazy(() =>
  import('@/pages/Dashboard/Student/ListingListPage').then((m) => ({ default: m.ListingListPage }))
);
const ListingDetailPage = lazy(() =>
  import('@/pages/Dashboard/Student/ListingDetailPage').then((m) => ({
    default: m.ListingDetailPage,
  }))
);
const MyApplicationsPage = lazy(() =>
  import('@/pages/Dashboard/Student/MyApplicationsPage').then((m) => ({
    default: m.MyApplicationsPage,
  }))
);
const SavedListingsPage = lazy(() =>
  import('@/pages/Dashboard/Student/SavedListingsPage').then((m) => ({
    default: m.SavedListingsPage,
  }))
);
const EmployabilityPage = lazy(() =>
  import('@/pages/Dashboard/Student/EmployabilityPage').then((m) => ({
    default: m.EmployabilityPage,
  }))
);
const RecruiterProfilePage = lazy(() =>
  import('@/pages/Dashboard/Recruiter/RecruiterProfilePage').then((m) => ({
    default: m.RecruiterProfilePage,
  }))
);
const RecruiterListingsPage = lazy(() =>
  import('@/pages/Dashboard/Recruiter/RecruiterListingsPage').then((m) => ({
    default: m.RecruiterListingsPage,
  }))
);
const ListingFormPage = lazy(() =>
  import('@/pages/Dashboard/Recruiter/ListingFormPage').then((m) => ({
    default: m.ListingFormPage,
  }))
);
const ApplicantsPage = lazy(() =>
  import('@/pages/Dashboard/Recruiter/ApplicantsPage').then((m) => ({ default: m.ApplicantsPage }))
);
const NotificationsPage = lazy(() =>
  import('@/pages/Dashboard/NotificationsPage').then((m) => ({ default: m.NotificationsPage }))
);
const StudentAnalyticsPage = lazy(() =>
  import('@/pages/Dashboard/Placement/StudentAnalyticsPage').then((m) => ({
    default: m.StudentAnalyticsPage,
  }))
);
const RecruiterManagementPage = lazy(() =>
  import('@/pages/Dashboard/Placement/RecruiterManagementPage').then((m) => ({
    default: m.RecruiterManagementPage,
  }))
);
const DrivesPage = lazy(() =>
  import('@/pages/Dashboard/Placement/DrivesPage').then((m) => ({ default: m.DrivesPage }))
);
const CareerAnalyticsPage = lazy(() =>
  import('@/pages/Dashboard/Placement/CareerAnalyticsPage').then((m) => ({
    default: m.CareerAnalyticsPage,
  }))
);
const ReportsPage = lazy(() =>
  import('@/pages/Dashboard/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardHome /> },
          { path: '/dashboard/notifications', element: <NotificationsPage /> },
          {
            element: <ProtectedRoute allowedRoles={['student', 'placementOfficer']} />,
            children: [{ path: '/dashboard/reports', element: <ReportsPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={['student']} />,
            children: [
              { path: '/dashboard/profile', element: <StudentProfilePage /> },
              { path: '/dashboard/ai-assistant', element: <AIAssistantPage /> },
              { path: '/dashboard/assessments', element: <AssessmentListPage /> },
              { path: '/dashboard/assessments/:id', element: <AssessmentDetailPage /> },
              { path: '/dashboard/assessments/:id/take', element: <AssessmentTakePage /> },
              { path: '/dashboard/assessments/:id/result', element: <AssessmentResultPage /> },
              {
                path: '/dashboard/assessments/:id/leaderboard',
                element: <AssessmentLeaderboardPage />,
              },
              { path: '/dashboard/results', element: <MyResultsPage /> },
              { path: '/dashboard/certificates', element: <MyCertificatesPage /> },
              { path: '/dashboard/jobs', element: <ListingListPage kind="job" /> },
              { path: '/dashboard/jobs/:id', element: <ListingDetailPage kind="job" /> },
              { path: '/dashboard/internships', element: <ListingListPage kind="internship" /> },
              {
                path: '/dashboard/internships/:id',
                element: <ListingDetailPage kind="internship" />,
              },
              { path: '/dashboard/applications', element: <MyApplicationsPage /> },
              { path: '/dashboard/saved', element: <SavedListingsPage /> },
              { path: '/dashboard/employability', element: <EmployabilityPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['recruiter']} />,
            children: [
              { path: '/dashboard/company-profile', element: <RecruiterProfilePage /> },
              { path: '/dashboard/my-jobs', element: <RecruiterListingsPage kind="job" /> },
              { path: '/dashboard/my-jobs/new', element: <ListingFormPage kind="job" /> },
              { path: '/dashboard/my-jobs/:id/edit', element: <ListingFormPage kind="job" /> },
              { path: '/dashboard/my-jobs/:id/applicants', element: <ApplicantsPage kind="job" /> },
              {
                path: '/dashboard/my-internships',
                element: <RecruiterListingsPage kind="internship" />,
              },
              {
                path: '/dashboard/my-internships/new',
                element: <ListingFormPage kind="internship" />,
              },
              {
                path: '/dashboard/my-internships/:id/edit',
                element: <ListingFormPage kind="internship" />,
              },
              {
                path: '/dashboard/my-internships/:id/applicants',
                element: <ApplicantsPage kind="internship" />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['placementOfficer']} />,
            children: [
              { path: '/dashboard/student-analytics', element: <StudentAnalyticsPage /> },
              { path: '/dashboard/recruiter-management', element: <RecruiterManagementPage /> },
              { path: '/dashboard/drives', element: <DrivesPage /> },
              { path: '/dashboard/career-analytics', element: <CareerAnalyticsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
