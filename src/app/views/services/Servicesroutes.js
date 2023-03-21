import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import CreateServices from './CreateService';
import ServiceDetails from './ServiceDetails';

const Services = Loadable(lazy(() => import('./Services')));

const servicesRoutes = [
  { path: '/dashboard/services', element: <Services />, auth: authRoles.admin },
  { path: '/dashboard/services/create', element: <CreateServices />, auth: authRoles.admin },
  { path: '/dashboard/services/details/:slug', element: <ServiceDetails />, auth: authRoles.admin },
];

export default servicesRoutes;
