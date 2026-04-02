import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import companiesMap from '../../data/companies.json';

const GAS_URL = import.meta.env.VITE_GAS_URL ?? '';

/**
 * QR code landing page: /go?c=004&u=1
 * Stores tracking params in localStorage, sends scan event to GAS,
 * and redirects to the main page.
 */
export default function GoRedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const companyId = searchParams.get('c');
    const userId = searchParams.get('u');

    if (companyId) localStorage.setItem('qr_company_id', companyId);
    if (userId) localStorage.setItem('qr_user_id', userId);
    localStorage.setItem('qr_scanned_at', new Date().toISOString());

    // GASにQRスキャンを記録（keepalive: ページ遷移後もリクエスト継続）
    if (GAS_URL && companyId) {
      const companyName = (companiesMap as Record<string, string>)[companyId] ?? '';
      fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        mode: 'no-cors',
        keepalive: true,
        body: JSON.stringify({
          event: 'qr_scan',
          companyId,
          userId: userId ?? '',
          companyName,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    navigate('/', { replace: true });
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #003c8f 100%)',
      }}
    >
      <CircularProgress sx={{ color: 'white', mb: 2 }} />
      <Typography sx={{ color: 'white' }}>デモ画面を読み込み中...</Typography>
    </Box>
  );
}
