import { useState } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress, Stack,
} from '@mui/material';
import { Phone, Email, ArrowForward, Language } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
import companiesMap from '../../data/companies.json';
import characterCelebrate from '../../assets/character-celebrate.png';

const PHONE_NUMBER = '070-4303-2374';
const EMAIL_ADDR = 'takumi.sato@aice.co.jp';
const MAILTO_HREF =
  'mailto:' + EMAIL_ADDR + '?subject=' +
  encodeURIComponent('建築向けチャットボットデモ お問い合わせ') +
  '&body=' +
  encodeURIComponent('デモを拝見しました。詳しくお話を伺いたいです。');

type FormState = 'input' | 'sending' | 'done' | 'error';

const GAS_URL = import.meta.env.VITE_GAS_URL ?? '';

function getTrackingParams() {
  return {
    companyId: localStorage.getItem('qr_company_id') ?? '',
    userId: localStorage.getItem('qr_user_id') ?? '',
  };
}

function getCompanyName(companyId: string): string | null {
  return (companiesMap as Record<string, string>)[companyId] ?? null;
}

function ContactCard({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Box
      component="a"
      href={href}
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        p: 2,
        borderRadius: '12px',
        minHeight: 48,
        border: '1px solid rgba(0,0,0,0.06)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: 'rgba(234,88,12,0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        },
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{label}</Typography>
    </Box>
  );
}

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('input');
  const [emailError, setEmailError] = useState('');

  const { companyId, userId } = getTrackingParams();
  const companyName = getCompanyName(companyId);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('メールアドレスを入力してください');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('正しいメールアドレスを入力してください');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) return;
    setFormState('sending');
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        redirect: 'follow',
        body: JSON.stringify({
          event: 'contact',
          email,
          message,
          companyId,
          userId,
          companyName: companyName ?? '',
          timestamp: new Date().toISOString(),
        }),
      });
      setFormState('done');
    } catch {
      setFormState('error');
    }
  };

  if (formState === 'done') {
    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', textAlign: 'center', px: 3,
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
          style={{ marginBottom: 20 }}
        >
          <Box
            component="img"
            src={characterCelebrate}
            alt=""
            sx={{ width: 100, height: 100, objectFit: 'contain', clipPath: 'inset(0 0 10% 0)' }}
          />
        </motion.div>
        <Typography sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
          ありがとうございます
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#71717a', mb: 3 }}>
          1営業日以内にご連絡いたします
        </Typography>
        <Stack direction="row" spacing={1}>
          <ContactCard
            icon={<Phone sx={{ fontSize: 18, color: '#71717a' }} />}
            label="電話"
            href={`tel:${PHONE_NUMBER.replace(/-/g, '')}`}
          />
          <ContactCard
            icon={<Email sx={{ fontSize: 18, color: '#71717a' }} />}
            label="メール"
            href={MAILTO_HREF}
          />
        </Stack>
      </MotionBox>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      sx={{ maxWidth: 440, mx: 'auto', px: 2, py: { xs: 2, md: 4 } }}
    >
      {/* Header */}
      <Typography sx={{ fontSize: { xs: 20, md: 22 }, fontWeight: 800, letterSpacing: '-0.03em', mb: 0.5 }}>
        お問い合わせ
      </Typography>
      <Typography sx={{ fontSize: 13, color: '#71717a', lineHeight: 1.7, mb: 3 }}>
        ご興味をお持ちいただきありがとうございます。お気軽にどうぞ。
      </Typography>

      {/* Contact cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}>
        <ContactCard
          icon={<Phone sx={{ fontSize: 18, color: '#71717a' }} />}
          label="電話"
          href={`tel:${PHONE_NUMBER.replace(/-/g, '')}`}
        />
        <ContactCard
          icon={<Email sx={{ fontSize: 18, color: '#71717a' }} />}
          label="メール"
          href={MAILTO_HREF}
        />
      </Stack>

      {/* Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(0,0,0,0.06)' }} />
        <Typography sx={{ fontSize: 11, color: '#a1a1aa', fontWeight: 600 }}>または</Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(0,0,0,0.06)' }} />
      </Box>

      {/* Form */}
      <TextField
        label="メールアドレス"
        type="email"
        required
        fullWidth
        size="small"
        placeholder="example@company.co.jp"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
        error={!!emailError}
        helperText={emailError}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#18181b' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#18181b' },
        }}
      />
      <TextField
        label="ご相談内容（任意）"
        multiline
        rows={6}
        fullWidth
        size="small"
        InputLabelProps={{ shrink: true }}
        placeholder="気になっていること、聞いてみたいことなど"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
        helperText={`${message.length}/500`}
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#18181b' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#18181b' },
        }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={formState === 'sending'}
        disableElevation
        endIcon={formState !== 'sending' && <ArrowForward sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: '10px',
          py: 1.3,
          fontWeight: 700,
          fontSize: 14,
          bgcolor: '#18181b',
          color: '#ffffff',
          '&:hover': { bgcolor: '#27272a' },
        }}
      >
        {formState === 'sending' ? <CircularProgress size={20} color="inherit" /> : '送信する'}
      </Button>
      {formState === 'error' && (
        <Typography sx={{ fontSize: 12, color: '#dc2626', mt: 1.5, textAlign: 'center' }}>
          送信に失敗しました。上のボタンから直接ご連絡ください。
        </Typography>
      )}

      <Box
        component="a"
        href="https://aice.co.jp/"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 4, textDecoration: 'none', '&:hover': { textDecoration: 'underline', textDecorationColor: '#71717a' } }}
      >
        <Language sx={{ fontSize: 13, color: '#a1a1aa' }} />
        <Typography sx={{ fontSize: 11, color: '#71717a', fontWeight: 600 }}>
          aice.co.jp
        </Typography>
      </Box>
    </MotionBox>
  );
}
