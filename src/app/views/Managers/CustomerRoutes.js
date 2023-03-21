import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Customers = Loadable(lazy(() => import('./Customers')));
const CreateCustomer = Loadable(lazy(() => import('./CRUD/CreateCustomer')));
const UpdateCustomer = Loadable(lazy(() => import('./CRUD/UpdateCustomer')));

const managerRoutes = [
  { path: '/dashboard/managers', element: <Customers />, auth: authRoles.admin },
  {
    path: '/dashboard/managers/create',
    element: <CreateCustomer />,
    auth: authRoles.admin,
  },
  {
    path: '/dashboard/managers/:id/update',
    element: <UpdateCustomer />,
    auth: authRoles.admin,
  },
];

export default managerRoutes;
