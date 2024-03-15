import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import Login from 'src/sections/login/Login';
import ShowSecrets from 'src/sections/user/view/ShowSecrets';

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
        { path: '/secrets/:id', element: <ShowSecrets /> },
        { path: 'settings', element: <SettingPage /> },
        { path: 'set', element: <SettingPage /> },
        { path: 'whitelist', element: <WhitelistSecrets /> },
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
  ]);

  return routes;
}
