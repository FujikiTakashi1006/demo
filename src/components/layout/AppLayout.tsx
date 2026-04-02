import { Box, Typography, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Mail, ArrowBackIosNew } from '@mui/icons-material';
import { lazy, Suspense } from 'react';
import characterCelebrate from '../../assets/character-celebrate.png';
import aiceLogo from '../../assets/s-960x540_v-fs_webp_b4f19ff5-f591-4855-bf62-f92e5e0260e5_small.webp';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

const AgentPage = lazy(() => import('../../features/agent/AgentPage'));

export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const isAgentPage = location.pathname === '/chat' || location.pathname === '/chat/';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 3 },
          width: isDesktop ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          bgcolor: 'background.default',
          pb: isDesktop ? undefined : 'calc(56px + env(safe-area-inset-bottom))',
        }}
      >
        {/* Fixed header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1.5, md: 3 },
          py: 1, pt: { xs: 'calc(8px + env(safe-area-inset-top))', md: 1 },
          position: 'fixed', top: 0, left: isDesktop ? DRAWER_WIDTH : 0, right: 0,
          zIndex: 10, bgcolor: 'background.default',
        }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '12px',
              cursor: 'pointer',
              bgcolor: '#f4f4f5',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: '#e4e4e7' },
              flexShrink: 0,
            }}
          >
            <ArrowBackIosNew sx={{ fontSize: 14, color: '#71717a' }} />
          </Box>
          <Box
            component="img"
            src={aiceLogo}
            alt="AICE"
            sx={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
          />
          <Box sx={{ flex: 1 }} />
          <Box
            onClick={() => navigate('/chat/contact')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: { xs: 1.5, md: 2.5 },
              py: 1,
              borderRadius: '10px',
              cursor: 'pointer',
              bgcolor: '#1e3a5f',
              color: '#fff',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: '#162d4a' },
              flexShrink: 0,
              minHeight: 44,
            }}
          >
            <Mail sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: { xs: 12, md: 14 }, fontWeight: 700, whiteSpace: 'nowrap' }}>
              お問い合わせ
            </Typography>
          </Box>
        </Box>

        {/* Spacer for fixed header */}
        <Box sx={{ height: { xs: 'calc(56px + env(safe-area-inset-top))', md: 56 } }} />

        {/* AgentPage is always mounted, hidden when not active */}
        <Box sx={{ display: isAgentPage ? 'block' : 'none', height: '100%' }}>
          <Suspense fallback={null}>
            <AgentPage />
          </Suspense>
        </Box>
        {/* Other pages via Outlet */}
        {!isAgentPage && <Outlet />}
      </Box>
      {!isDesktop && (
        <BottomNavigation
          value={location.pathname}
          onChange={(_event, newValue) => navigate(newValue)}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            pb: 'env(safe-area-inset-bottom)',
            height: 'calc(56px + env(safe-area-inset-bottom))',
            zIndex: theme.zIndex.appBar,
          }}
        >
          <BottomNavigationAction label="エージェント" value="/chat" icon={<Box component="img" src={characterCelebrate} alt="" sx={{ width: 32, height: 32, objectFit: 'contain', clipPath: 'inset(0 0 10% 0)' }} />} />
          <BottomNavigationAction label="ダッシュボード" value="/chat/dashboard" icon={<BarChart />} />
        </BottomNavigation>
      )}
    </Box>
  );
}
