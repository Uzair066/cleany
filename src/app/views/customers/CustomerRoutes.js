import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Customers = Loadable(lazy(() => import('./Customers')));
const CreateCustomer = Loadable(lazy(() => import('./CRUD/CreateCustomer')));
const UpdateCustomer = Loadable(lazy(() => import('./CRUD/UpdateCustomer')));

const customerRoutes = [
  { path: '/dashboard/customers', element: <Customers />, auth: authRoles.admin },
  {
    path: '/dashboard/customers/create',
    element: <CreateCustomer />,
    auth: authRoles.admin,
  },
  {
    path: '/dashboard/customers/:id/update',
    element: <UpdateCustomer />,
    auth: authRoles.admin,
  },
];

export default customerRoutes;
