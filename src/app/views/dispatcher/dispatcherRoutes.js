import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Dispatcher = Loadable(lazy(() => import('./Dispatcher')));

const dispatcherRoutes = [
  { path: '/dashboard/dispatcher', element: <Dispatcher />, auth: authRoles.admin },
];

export default dispatcherRoutes;
