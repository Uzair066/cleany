import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Reports = Loadable(lazy(() => import('./reports')));
const PendingReports = Loadable(lazy(() => import('./pending-reports')));
const AllBookingsCreationDate = Loadable(lazy(() => import('./allBookingsCreationDate')));
const StripePayments = Loadable(lazy(() => import('./stripePayments')));

const ReportsRoutes = [
  { path: '/dashboard/reports', element: <Reports />, auth: authRoles.admin },
  { path: '/dashboard/pending-reports', element: <PendingReports />, auth: authRoles.admin },
  {
    path: '/dashboard/booking-creation-date',
    element: <AllBookingsCreationDate />,
    auth: authRoles.admin,
  },
  {
    path: '/dashboard/reports/stripe-payments',
    element: <StripePayments />,
    auth: authRoles.admin,
  },
];

export default ReportsRoutes;
