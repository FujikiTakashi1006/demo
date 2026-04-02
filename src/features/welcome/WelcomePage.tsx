import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { Chat, Calculate, Architecture } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import heroVideo from '../../assets/bg.mp4';
import aiceLogo from '../../assets/s-960x540_v-fs_webp_b4f19ff5-f591-4855-bf62-f92e5e0260e5_small.webp';

/* ─── Colors (AICE site palette) ─── */
const C = {
  navy: '#1a1c4f',
  red: '#e35050',
  redLight: '#ef7070',
  text: '#1f3542',
  gray: '#7d7d7d',
  bg: '#fcfcfc',
};

/* ─── keyframes ─── */

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  25%  { background-position: 100% 50%; }
  50%  { background-position: 100% 0%; }
  75%  { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
`;


/* ─── data ─── */

const demos = [
  {
    id: 'chat',
    path: '/chat',
    icon: <Chat sx={{ fontSize: 24 }} />,
    title: 'AIチャットデモ',
    video: heroVideo as string | null,
    ready: true,
  },
  {
    id: 'estimation',
    path: '/estimation',
    icon: <Calculate sx={{ fontSize: 24 }} />,
    title: 'AI積算デモ',
    video: null as string | null,
    ready: false,
  },
  {
    id: 'drawing',
    path: '/drawing',
    icon: <Architecture sx={{ fontSize: 24 }} />,
    title: 'AI図面解析デモ',
    video: null as string | null,
    ready: false,
  },
];


/* ─── Loading: canvas particle ring ─── */

function ParticleRing({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const size = 200;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 70;
    const particleCount = 60;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const time = Date.now() * 0.002;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26,28,79,0.06)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const endAngle = -Math.PI / 2 + (Math.PI * 2 * progress);
      if (progress > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI / 2, endAngle);
        const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
        grad.addColorStop(0, C.navy);
        grad.addColorStop(1, C.red);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        if (t > progress) continue;
        const angle = -Math.PI / 2 + t * Math.PI * 2;
        const wobble = Math.sin(time + i * 0.8) * 6;
        const px = cx + Math.cos(angle) * (radius + wobble);
        const py = cy + Math.sin(angle) * (radius + wobble);
        const alpha = 0.15 + 0.6 * (1 - Math.abs(t - progress) * 3);
        const size2 = 1 + Math.sin(time + i) * 0.5;
        // Blend from navy to red across the ring
        const mix = t;
        const r = Math.round(26 + (227 - 26) * mix);
        const g = Math.round(28 + (80 - 28) * mix);
        const b = Math.round(79 + (80 - 79) * mix);

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, size2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();
      }

      if (progress > 0 && progress < 1) {
        const gx = cx + Math.cos(endAngle) * radius;
        const gy = cy + Math.sin(endAngle) * radius;
        const glowGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 12);
        glowGrad.addColorStop(0, 'rgba(227, 80, 80, 0.5)');
        glowGrad.addColorStop(1, 'rgba(227, 80, 80, 0)');
        ctx.beginPath();
        ctx.arc(gx, gy, 12, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(gx, gy, 3, 0, Math.PI * 2);
        ctx.fillStyle = C.red;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [progress]);

  return <canvas ref={canvasRef} style={{ width: 200, height: 200, position: 'absolute' }} />;
}

/* ─── Tagline GSAP reveal ─── */

function TaglineReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLSpanElement>('.tl-char');

    gsap.set(chars, { y: '110%', opacity: 0 });

    const tl = gsap.timeline();

    tl.to(chars, {
      y: '0%',
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
    });

    return () => { tl.kill(); };
  }, []);

  const lines = [
    { text: 'AIの力で', className: 'tl-line-0', sx: { fontSize: 20, fontWeight: 700, color: C.gray, letterSpacing: '0.08em' } },
    { text: '日本の生産性を', className: 'tl-line-1', sx: { fontSize: { xs: 34, sm: 40 }, fontWeight: 900, color: C.navy, letterSpacing: '-0.03em' } },
    { text: '10倍に', className: 'tl-line-2', sx: { fontSize: { xs: 72, sm: 88 }, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: C.red, filter: `drop-shadow(0 4px 16px ${C.red}40)` } },
  ];

  return (
    <Box ref={containerRef} sx={{ textAlign: 'center' }}>
      {lines.map((line, li) => (
        <Box key={li} className={`tl-line ${line.className}`} sx={{ overflow: 'hidden', pb: li < 2 ? 0.5 : 0 }}>
          <Typography component="div" sx={{ ...line.sx, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {line.text.split('').map((char, ci) => (
              <span key={ci} className="tl-char" style={{ display: 'inline-block', willChange: 'transform' }}>
                {char}
              </span>
            ))}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ─── Component ─── */

type Phase = 'loading' | 'tagline' | 'collapse' | 'circle' | 'main';
type MainStep = 0 | 1 | 2;

let hasSeenLoading = false;

export default function WelcomePage() {
  const navigate = useNavigate();
  const skipLoading = hasSeenLoading;
  const [phase, setPhase] = useState<Phase>(skipLoading ? 'main' : 'loading');
  const [progress, setProgress] = useState(skipLoading ? 1 : 0);
  const [, setMainStep] = useState<MainStep>(skipLoading ? 2 : 0);
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    if (skipLoading) return;
    const start = Date.now();
    const duration = 2200;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setProgress(eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (skipLoading) return;
    const t1 = setTimeout(() => setPhase('tagline'), 2400);
    const t2 = setTimeout(() => setPhase('collapse'), 4000);
    const t3 = setTimeout(() => setPhase('circle'), 4600);
    const t4 = setTimeout(() => {
      setPhase('main');
      hasSeenLoading = true;
    }, 5400);
    const t5 = setTimeout(() => setMainStep(1), 9500);
    const t6 = setTimeout(() => setMainStep(2), 13000);
    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, []);

  const isLoading = phase !== 'main';
  const percent = Math.round(progress * 100);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        '@supports (min-height: 100dvh)': { minHeight: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
        position: 'relative',
        overflow: 'hidden',
        px: 3,
      }}
    >
      {/* ===== LOADING ===== */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: C.bg,
              zIndex: 20,
              overflow: 'hidden',
            }}
          >
            {/* Phase: loading */}
            {phase === 'loading' && (
              <>
                <Box sx={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <ParticleRing progress={progress} />
                  <motion.img
                    src={aiceLogo}
                    alt="AICE"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover', position: 'relative', zIndex: 1 }}
                  />
                </Box>
                <Typography sx={{
                  fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', color: C.navy,
                }}>
                  {percent}%
                </Typography>
              </>
            )}

            {/* Phase: tagline — GSAP text reveal */}
            {phase === 'tagline' && <TaglineReveal />}

            {/* Phase: collapse — text shrinks to a point */}
            {phase === 'collapse' && (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0.6 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 1, 1] }}
                style={{ textAlign: 'center' }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: C.gray, letterSpacing: '0.08em', mb: 0.5 }}>
                  AIの力で
                </Typography>
                <Typography sx={{ fontSize: { xs: 34, sm: 40 }, fontWeight: 900, color: C.navy, letterSpacing: '-0.03em', mb: 0.5 }}>
                  日本の生産性を
                </Typography>
                <Typography sx={{ fontSize: { xs: 72, sm: 88 }, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: C.red }}>
                  10倍に
                </Typography>
              </motion.div>
            )}

            {/* Phase: circle — point becomes ring that expands */}
            {phase === 'circle' && (
              <>
                <motion.div
                  initial={{ width: 8, height: 8, opacity: 1 }}
                  animate={{ width: 2000, height: 2000, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute', borderRadius: '50%',
                    background: `radial-gradient(circle, ${C.navy}30 0%, ${C.navy}0a 40%, transparent 70%)`,
                    zIndex: 2,
                  }}
                />
                <motion.div
                  initial={{ width: 6, height: 6, opacity: 0.8 }}
                  animate={{ width: 1600, height: 1600, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  style={{ position: 'absolute', borderRadius: '50%', border: `2px solid ${C.red}`, zIndex: 3 }}
                />
                <motion.div
                  initial={{ width: 4, height: 4, opacity: 0.4 }}
                  animate={{ width: 1200, height: 1200, opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
                  style={{ position: 'absolute', borderRadius: '50%', border: `1px solid ${C.navy}`, zIndex: 3 }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN ===== */}
      {phase === 'main' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0,
            display: 'flex', flexDirection: 'column',
            background: C.bg,
          }}
        >

          {/* ── Background gradient animation ── */}
          <Box sx={{
            position: 'absolute',
            top: '-20%',
            right: '-15%',
            width: '80%',
            height: '80%',
            background: `radial-gradient(ellipse at center, ${C.red}40, ${C.navy}30, transparent 70%)`,
            backgroundSize: '200% 200%',
            animation: `${gradientShift} 30s ease infinite`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* ── Top Navigation ── */}
          <Box sx={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 0, zIndex: 10,
          }}>
            {/* Left: logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box component="img" src={aiceLogo} alt="AICE"
                sx={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }}
              />
            </motion.div>

            <Box />
          </Box>

          {/* ── Body: vertical text + hero video ── */}
          <Box sx={{
            flex: 1, display: 'flex', position: 'relative',
            overflow: 'hidden', mt: 0.5,
          }}>
            {/* Left: vertical Japanese text — centered between left edge and video */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', left: 0, width: '25%', top: 0, bottom: 0, zIndex: 2, display: 'flex', justifyContent: 'center' }}
            >
              <Box sx={{
                writingMode: 'vertical-rl',
                display: 'flex', alignItems: 'flex-start',
                pt: 1,
              }}>
                <Typography sx={{
                  fontSize: { xs: 28, sm: 34 },
                  fontWeight: 900,
                  color: C.navy,
                  letterSpacing: '0.12em',
                  lineHeight: 1.6,
                }}>
                  建築をＡＩで
                </Typography>
                <Typography sx={{
                  fontSize: { xs: 28, sm: 34 },
                  fontWeight: 900,
                  color: C.navy,
                  letterSpacing: '0.12em',
                  lineHeight: 1.6,
                  mt: 1,
                }}>
                  もっと自由に
                </Typography>
              </Box>
            </motion.div>

            {/* Hero video — positioned bottom-right */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                right: 0,
                top: '3%',
                bottom: '10%',
                left: '25%',
                overflow: 'hidden',
                borderRadius: '16px 0 0 16px',
                zIndex: 1,
              }}
            >
              <AnimatePresence mode="wait">
                {demos[activeDemo].video ? (
                  <motion.video
                    key={activeDemo}
                    src={demos[activeDemo].video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${C.navy}12, ${C.red}0a, ${C.navy}08, ${C.red}06)`,
                      backgroundSize: '300% 300%',
                      animation: `${gradientShift} 12s ease infinite`,
                    }}
                  >
                    <Typography sx={{ fontSize: 48, mb: 2, opacity: 0.3 }}>
                      {demos[activeDemo].icon}
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: C.navy, opacity: 0.6 }}>
                      {demos[activeDemo].title}
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.gray, mt: 1 }}>
                      Coming Soon
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Gradient overlay from bottom-left */}
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to top right, ${C.bg} 0%, ${C.bg}dd 25%, ${C.bg}88 45%, ${C.bg}33 65%, transparent 85%)`,
                pointerEvents: 'none',
              }} />

              {/* 体験ボタン — center of video, same fade as placeholder */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`btn-${activeDemo}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                  }}
                >
                  <Box
                    onClick={() => {
                      const demo = demos[activeDemo];
                      if (demo.ready) navigate(demo.path, { replace: true });
                    }}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 1,
                      px: 5, py: 1.8,
                      bgcolor: 'transparent',
                      color: C.navy + 'bb',
                      border: `1.5px solid ${C.navy}60`,
                      borderRadius: '30px',
                      cursor: demos[activeDemo].ready ? 'pointer' : 'default',
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      transition: 'background 0.25s ease',
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: C.navy, color: '#fff' },
                      '&:active': { transform: 'scale(0.97)' },
                    }}
                  >
                    体験する →
                  </Box>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Demo selector buttons — left side, rendered AFTER video for z-order */}
            <Box sx={{
              position: 'absolute',
              left: { xs: 16, sm: 24 },
              bottom: { xs: '18%', sm: '22%' },
              display: 'flex', flexDirection: 'column', gap: 1.5,
              zIndex: 10,
            }}>
              {demos.map((demo, i) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Box
                    onClick={() => setActiveDemo(i)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 3, py: 1.5,
                      bgcolor: activeDemo === i ? C.navy : 'transparent',
                      color: activeDemo === i ? '#fff' : C.navy,
                      border: `1.5px solid ${activeDemo === i ? C.navy : C.navy + '40'}`,
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        bgcolor: activeDemo === i ? C.navy : C.navy + '10',
                        borderColor: C.navy,
                      },
                      '&:active': { transform: 'scale(0.97)' },
                    }}
                  >
                    {demo.icon}
                    {demo.title}
                  </Box>
                </motion.div>
              ))}

            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
