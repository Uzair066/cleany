import React from 'react';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
const MainDashboard = Loadable(lazy(() => import('./mainDashboard')));
const CustomerDashboard = Loadable(lazy(() => import('./customerDashboard')));

function IndexMain() {
  const user = JSON.parse(localStorage.getItem('user'));
  return <>{user.role === 'Customer' ? <CustomerDashboard /> : <MainDashboard />}</>;
}

export default IndexMain;
