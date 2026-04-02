import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Box,
} from '@mui/material';
import { BarChart } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import characterCelebrate from '../../assets/character-celebrate.png';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'AIエージェント', path: '/chat', icon: <Box component="img" src={characterCelebrate} alt="" sx={{ width: 32, height: 32, objectFit: 'contain', clipPath: 'inset(0 0 10% 0)' }} /> },
  { label: 'ダッシュボード', path: '/chat/dashboard', icon: <BarChart /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ pt: 5, pb: 3 }} />

      <Box sx={{ px: 1, flex: 1 }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ py: 1.2 }}
            >
              <ListItemIcon sx={{ fontSize: 20 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ px: 2.5, pb: 3 }}>
        <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>
          Powered by AICE
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
