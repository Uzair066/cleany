import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const AllBookings = Loadable(lazy(() => import('./AllBookings/allBookings')));
const ApprecisteUs = Loadable(lazy(() => import('./apprecisteUs')));
const Profile = Loadable(lazy(() => import('./Profile/profile')));
const Invoices = Loadable(lazy(() => import('./Invoices/invoices')));
const PaymentMethod = Loadable(lazy(() => import('./Payment Method/PaymentMethod')));

const customerViewRoutes = [
  { path: '/dashboard/customer-booking', element: <AllBookings />, auth: authRoles.admin },
  { path: '/dashboard/appreciate', element: <ApprecisteUs />, auth: authRoles.admin },
  { path: '/dashboard/settings/profile', element: <Profile />, auth: authRoles.admin },
  { path: '/dashboard/customer/invoices', element: <Invoices />, auth: authRoles.admin },
  { path: '/dashboard/payment-methods', element: <PaymentMethod />, auth: authRoles.admin },
];

export default customerViewRoutes;
