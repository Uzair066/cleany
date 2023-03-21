import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Company = Loadable(lazy(() => import('./Company')));
const Tax = Loadable(lazy(() => import('./Tax')));

const dashboardRoutes = [
  { path: '/dashboard/company', element: <Company />, auth: authRoles.admin },
  { path: '/dashboard/tax', element: <Tax />, auth: authRoles.admin },
];

export default dashboardRoutes;
