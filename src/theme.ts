import { createTheme } from '@mui/material/styles';

// Construction-specific: safety orange — no tech company uses this
const accent = '#ea580c';
const accentLight = '#fb923c';
const dark = '#18181b';

const theme = createTheme({
  palette: {
    primary: { main: dark },
    secondary: { main: accent, light: accentLight },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: '#18181b', secondary: '#71717a' },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "SF Pro Display", "Helvetica Neue", sans-serif',
    h5: { fontWeight: 800, letterSpacing: '-0.03em' },
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
    subtitle1: { fontWeight: 700, letterSpacing: '-0.01em' },
    body2: { lineHeight: 1.7 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#a1a1aa',
          transition: 'color 0.2s',
          '&.Mui-selected': { color: accent },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 10 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: dark,
          color: '#ffffff',
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          color: 'rgba(255,255,255,0.5)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: '#ffffff',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(234,88,12,0.12)',
            color: accentLight,
            '&:hover': {
              backgroundColor: 'rgba(234,88,12,0.18)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { color: 'inherit', minWidth: 38 },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderRadius: '14px !important',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          marginBottom: 12,
          '&:before': { display: 'none' },
          '&.Mui-expanded': { marginBottom: 12 },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { minHeight: 52, '&.Mui-expanded': { minHeight: 52 } },
        content: { margin: '12px 0', '&.Mui-expanded': { margin: '12px 0' } },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: '#f4f4f5', borderRadius: 4 },
        bar: { borderRadius: 4, background: `linear-gradient(90deg, ${accent}, ${accentLight})` },
      },
    },
  },
});

export default theme;
