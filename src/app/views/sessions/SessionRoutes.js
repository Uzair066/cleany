import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));
const JwtRegister = Loadable(lazy(() => import('./JwtRegister')));
const NewProfile = Loadable(lazy(() => import('./Profile.jsx')));
const ResetPassword = Loadable(lazy(() => import('./ResetPassword')));

const sessionRoutes = [
  { path: '/session/signup', element: <JwtRegister /> },
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },
  { path: '/session/reset-password', element: <ResetPassword /> },
  { path: '/session/new-profile', element: <NewProfile /> },
  { path: '/session/404', element: <NotFound /> },
  { path: '/', element: <Navigate replace to="/session/signin" /> },
];

export default sessionRoutes;
