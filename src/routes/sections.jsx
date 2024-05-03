import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import PrScanSecret from 'src/pages/PrScanSecret';
import FetchScanFile from 'src/pages/FetchScanFile';
import DashboardLayout from 'src/layouts/dashboard';

import Login from 'src/sections/login/Login';
import ErrorPage from 'src/sections/error/ErrorPage';
import ShowSecrets from 'src/sections/user/view/ShowSecrets';

import AwsLogin from '../AwsLogin';
import SettingPage from './components/SettingPage';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const WhitelistSecrets = lazy(() => import('src/pages/WhitelistSecrets'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'repos', element: <UserPage /> },
        { path: '/secrets/:id/:startIndex/:endIndex', element: <ShowSecrets /> },
        { path: 'settings', element: <SettingPage /> },
        { path: 'set', element: <SettingPage /> },
        { path: 'whitelist', element: <WhitelistSecrets /> },
        { path: 'pr-scan-secret', element: <PrScanSecret /> },
        {
          path: 'showNewSecret',
          element: <FetchScanFile />,
        },
        { path: '/error', element: <ErrorPage /> },

        // { path: '/login', element: <Login /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    { path: '/aws-login', element: <AwsLogin /> },
  ]);

  return routes;
}
