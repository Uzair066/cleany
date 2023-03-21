import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Calendar = Loadable(lazy(() => import('./calendar')));

const calendarRoutes = [
  { path: '/dashboard/calendar', element: <Calendar />, auth: authRoles.admin },
];

export default calendarRoutes;
