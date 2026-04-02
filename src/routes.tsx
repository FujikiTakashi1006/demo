import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const AgentPage = lazy(() => import('./features/agent/AgentPage'));
const GoRedirectPage = lazy(() => import('./features/auth/GoRedirectPage'));
const WelcomePage = lazy(() => import('./features/welcome/WelcomePage'));
const ContactPage = lazy(() => import('./features/contact/ContactPage'));

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );
}

const router = createBrowserRouter([
  { path: '/go', element: <Suspense fallback={<Loading />}><GoRedirectPage /></Suspense> },
  { index: true, path: '/', element: <Suspense fallback={<Loading />}><WelcomePage /></Suspense> },
  {
    path: '/chat',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><AgentPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<Loading />}><ContactPage /></Suspense> },
    ],
  },
  { path: '/welcome', element: <Suspense fallback={<Loading />}><WelcomePage /></Suspense> },
]);

export default router;
