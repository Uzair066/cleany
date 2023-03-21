import { authRoles } from '../../auth/authRoles';
import IndexMain from './indexMain';

const dashboardRoutes = [
  { path: '/dashboard/default', element: <IndexMain />, auth: authRoles.admin },
];

export default dashboardRoutes;
