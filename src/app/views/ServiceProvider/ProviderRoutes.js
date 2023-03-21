import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const ServiceProvider = Loadable(lazy(() => import('./ServiceProvider')));
const CreateProvider = Loadable(lazy(() => import('./CRUD/CreateProvider')));
const UpdateProvider = Loadable(lazy(() => import('./CRUD/UpdateProvider')));
const CalendarLeaves = Loadable(lazy(() => import('./SubPages/WorkCalendar')));

const servicesProviderRoutes = [
  { path: '/dashboard/service-providers', element: <ServiceProvider />, auth: authRoles.admin },
  {
    path: '/dashboard/service-providers/create',
    element: <CreateProvider />,
    auth: authRoles.admin,
  },
  {
    path: '/dashboard/service-providers/:id/update',
    element: <UpdateProvider />,
    auth: authRoles.admin,
  },
  {
    path: '/dashboard/service-providers/:id/work_calendar/',
    element: <CalendarLeaves />,
    auth: authRoles.admin,
  },
];

export default servicesProviderRoutes;
