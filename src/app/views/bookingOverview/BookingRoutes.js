import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const BookingOrders = Loadable(lazy(() => import('./BookingOrders')));
const BookingOrderDetails = Loadable(lazy(() => import('./SubPages/BookingOrderDetails')));
const BookingAttachments = Loadable(lazy(() => import('./SubPages/BookingAttachments')));

const bookingRoutes = [
  { path: '/dashboard/booking-appointments', element: <BookingOrders />, auth: authRoles.admin },
  {
    path: '/dashboard/booking-appointments/:id/details/',
    element: <BookingOrderDetails />,
    auth: authRoles.admin,
  },
  {
    path: '/dashboard/booking-appointments/:id/details/booking-attachments',
    element: <BookingAttachments />,
    auth: authRoles.admin,
  },
];

export default bookingRoutes;
