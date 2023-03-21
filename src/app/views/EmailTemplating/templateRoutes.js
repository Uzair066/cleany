import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const EmailTemplate = Loadable(lazy(() => import('./emailTemplate')));

const emailTemplateRoutes = [
  { path: '/dashboard/email-template', element: <EmailTemplate />, auth: authRoles.admin },
];

export default emailTemplateRoutes;
