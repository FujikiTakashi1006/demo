import { useState } from 'react';
import {
  Box, Typography, useMediaQuery, useTheme, Chip, Stack,
} from '@mui/material';
import { Construction, CalendarMonth, Engineering, WbSunny } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion.create(Box);
import sitesData from '../../data/sites.json';
import scheduleData from '../../data/schedule.json';
import workersData from '../../data/workers.json';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  on_track: { label: '順調', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  delayed: { label: '遅延', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  near_complete: { label: '完了間近', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
};

const workerStatusLabel = (w: typeof workersData[0]) => {
  if (w.status === 'active') return { label: '稼働中', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' };
  return { label: `${w.availableDate}〜`, color: '#ea580c', bg: 'rgba(234,88,12,0.08)' };
};

const totalWorkers = sitesData.reduce((sum, s) => sum + s.workers, 0);
const avgProgress = Math.round(sitesData.reduce((sum, s) => sum + s.progress, 0) / sitesData.length);
const delayedCount = sitesData.filter((s) => s.status === 'delayed').length;

// Schedule grouped by date
const scheduleByDate = scheduleData.reduce<Record<string, typeof scheduleData>>((acc, item) => {
  const key = `${item.date}（${item.dayOfWeek}）`;
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});

// Workers stats
const activeCount = workersData.filter((w) => w.status === 'active').length;
const availableCount = workersData.filter((w) => w.status === 'available_from').length;
const workersByTrade = workersData.reduce<Record<string, number>>((acc, w) => {
  acc[w.trade] = (acc[w.trade] || 0) + 1;
  return acc;
}, {});
const tradeEntries = Object.entries(workersByTrade).sort((a, b) => b[1] - a[1]);
const tradeColors = ['#ea580c', '#2563eb', '#8b5cf6', '#16a34a', '#d97706', '#71717a', '#ec4899', '#06b6d4', '#f43f5e', '#84cc16'];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

type TabId = 'sites' | 'schedule' | 'workers';

const tabs: { id: TabId; label: string; icon: React.ReactNode; count: number }[] = [
  { id: 'workers', label: '職人リスト', icon: <Engineering sx={{ fontSize: 16 }} />, count: workersData.length },
  { id: 'schedule', label: '今週の工程', icon: <CalendarMonth sx={{ fontSize: 16 }} />, count: scheduleData.length },
  { id: 'sites', label: '現場一覧', icon: <Construction sx={{ fontSize: 16 }} />, count: sitesData.length },
];

function SitesPanel() {
  return (
    <Box>
      {sitesData.map((site) => {
        const s = statusConfig[site.status];
        return (
          <Box key={site.id} sx={{
            px: 2, py: 1.5,
            borderBottom: '1px solid #f4f4f5',
            '&:last-child': { borderBottom: 'none' },
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>{site.name}</Typography>
                <Typography sx={{ fontSize: 14, color: '#a1a1aa' }}>{site.location} / {site.type}</Typography>
              </Box>
              <Chip label={s.label} size="small"
                sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: 14, border: 'none', height: 28, flexShrink: 0 }}
              />
            </Stack>
            {/* Visual progress bar */}
            <Box sx={{ position: 'relative', height: 24, bgcolor: '#f4f4f5', borderRadius: '6px', overflow: 'hidden', mb: 0.75 }}>
              <Box sx={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: `${site.progress}%`,
                bgcolor: s.color,
                opacity: 0.15,
                borderRadius: '6px',
                '@keyframes site-bar-bg': { from: { width: 0 }, to: { width: `${site.progress}%` } },
                animation: 'site-bar-bg 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
              }} />
              <Box sx={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: `${site.progress}%`,
                background: `linear-gradient(90deg, ${s.color}cc, ${s.color}88)`,
                borderRadius: '6px',
                '@keyframes site-bar-fill': { from: { width: 0 }, to: { width: `${site.progress}%` } },
                animation: 'site-bar-fill 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
              }} />
              <Typography sx={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, fontWeight: 800, color: '#18181b',
              }}>
                {site.progress}%
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Typography sx={{ fontSize: 14, color: '#a1a1aa' }}>
                <Typography component="span" sx={{ fontSize: 14, fontWeight: 700, color: '#71717a' }}>{site.workers}</Typography>名稼働
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#a1a1aa' }}>〜 {site.endDate}</Typography>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}

function SchedulePanel() {
  const dates = Object.keys(scheduleByDate);
  const shortDates = dates.map((d) => {
    const items = scheduleByDate[d];
    const raw = items[0].date;
    const m = parseInt(raw.split('-')[1]);
    const day = parseInt(raw.split('-')[2]);
    return `${m}/${day}`;
  });
  const dailyWorkers = dates.map((d) => scheduleByDate[d].reduce((sum, item) => sum + item.workers, 0));
  const maxW = Math.max(...dailyWorkers);
  const barH = 22;
  const gap = 5;
  const labelW = 40;
  const chartW = 260;
  const svgH = dates.length * (barH + gap) - gap;

  return (
    <Box>
      {/* Daily workers bar chart */}
      <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #f4f4f5' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.08em', mb: 1.5 }}>
          日別 投入人数
        </Typography>
        <svg width="100%" viewBox={`0 0 ${labelW + chartW + 40} ${svgH}`} style={{ display: 'block' }}>
          <style>{`
            ${dates.map((_, i) => {
              const barW = (dailyWorkers[i] / maxW) * chartW;
              return `
                @keyframes bar-grow-${i} { from { width: 0; } to { width: ${barW}px; } }
                .schedule-bar-${i} { animation: bar-grow-${i} 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s forwards; width: 0; }
                @keyframes bar-text-${i} { from { opacity: 0; } to { opacity: 1; } }
                .schedule-text-${i} { animation: bar-text-${i} 0.3s ease ${i * 0.1 + 0.3}s forwards; opacity: 0; }
              `;
            }).join('')}
          `}</style>
          {dates.map((date, i) => {
            const y = i * (barH + gap);
            const val = dailyWorkers[i];
            const barW = (val / maxW) * chartW;
            return (
              <g key={date}>
                <text x={labelW - 6} y={y + barH / 2 + 4} textAnchor="end"
                  fontSize="10" fontWeight="600" fill="#71717a"
                  fontFamily="'Noto Sans JP', sans-serif">
                  {shortDates[i]}
                </text>
                <rect x={labelW} y={y} width={chartW} height={barH} rx={4} fill="#f4f4f5" />
                <rect className={`schedule-bar-${i}`} x={labelW} y={y} height={barH} rx={4} fill="#ea580c" opacity={0.8} />
                <text className={`schedule-text-${i}`} x={labelW + barW + 6} y={y + barH / 2 + 4}
                  fontSize="10" fontWeight="700" fill="#18181b"
                  fontFamily="'Noto Sans JP', sans-serif">
                  {val}名
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
      {/* List */}
      {scheduleData.map((item, i) => {
        const isNewDate = i === 0 || scheduleData[i - 1].date !== item.date;
        return (
          <Box key={item.id}>
            {isNewDate && (
              <Box sx={{
                px: 2, py: 0.5, bgcolor: '#fafafa',
                borderTop: i > 0 ? '1px solid #f4f4f5' : 'none',
              }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.04em' }}>
                  {item.date}（{item.dayOfWeek}）
                </Typography>
              </Box>
            )}
            <Box sx={{
              px: 2, py: 1.25,
              borderTop: '1px solid #f4f4f5',
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ea580c', flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{item.task}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: '#a1a1aa', flexShrink: 0 }}>{item.site}</Typography>
              <Box sx={{
                bgcolor: '#fafafa', borderRadius: '6px', px: 0.75, py: 0.25,
                fontSize: 14, fontWeight: 700, color: '#71717a', flexShrink: 0,
              }}>
                {item.workers}名
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function WorkersPanel() {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const activeRatio = activeCount / workersData.length;

  return (
    <Box>
      {/* Donut + trade breakdown */}
      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid #f4f4f5' }}>
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <svg width="88" height="88" viewBox="0 0 88 88">
            <style>{`
              @keyframes donut-active {
                from { stroke-dasharray: 0 ${circ}; }
                to { stroke-dasharray: ${activeRatio * circ} ${circ}; }
              }
              @keyframes donut-available {
                from { stroke-dasharray: 0 ${circ}; }
                to { stroke-dasharray: ${(1 - activeRatio) * circ} ${circ}; }
              }
              .donut-active { animation: donut-active 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
              .donut-available { animation: donut-available 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; stroke-dasharray: 0 ${circ}; }
            `}</style>
            <circle cx="44" cy="44" r={r} fill="none" stroke="#f4f4f5" strokeWidth="9" />
            <circle className="donut-active" cx="44" cy="44" r={r} fill="none" stroke="#16a34a" strokeWidth="9"
              strokeLinecap="round" transform="rotate(-90 44 44)" />
            <circle className="donut-available" cx="44" cy="44" r={r} fill="none" stroke="#ea580c" strokeWidth="9"
              strokeLinecap="butt" transform={`rotate(${-90 + activeRatio * 360} 44 44)`} />
            <text x="44" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill="#18181b"
              fontFamily="'Noto Sans JP', sans-serif">{workersData.length}</text>
            <text x="44" y="53" textAnchor="middle" fontSize="9" fill="#a1a1aa"
              fontFamily="'Noto Sans JP', sans-serif">名</text>
          </svg>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16a34a', flexShrink: 0 }} />
            <Typography sx={{ fontSize: 19, fontWeight: 600 }}>稼働中</Typography>
            <Typography sx={{ fontSize: 19, fontWeight: 800, ml: 'auto' }}>{activeCount}名</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c', flexShrink: 0 }} />
            <Typography sx={{ fontSize: 19, fontWeight: 600 }}>空き予定</Typography>
            <Typography sx={{ fontSize: 19, fontWeight: 800, ml: 'auto' }}>{availableCount}名</Typography>
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', mb: 0.75, letterSpacing: '0.06em' }}>職種内訳</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tradeEntries.map(([trade, count], i) => (
              <Chip key={trade} label={`${trade} ${count}`} size="small"
                sx={{
                  bgcolor: `${tradeColors[i % tradeColors.length]}14`,
                  color: tradeColors[i % tradeColors.length],
                  fontWeight: 700, fontSize: 14, height: 28, border: 'none',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* List */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
      }}>
        {workersData.map((w) => {
          const s = workerStatusLabel(w);
          return (
            <Box key={w.id} sx={{
              px: 2, py: 1.25,
              borderBottom: '1px solid #f4f4f5',
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Box sx={{
                width: 34, height: 34, borderRadius: '8px',
                bgcolor: s.color === '#16a34a' ? 'rgba(22,163,74,0.06)' : 'rgba(234,88,12,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Typography sx={{ fontSize: 19, fontWeight: 800, color: s.color }}>
                  {w.name.charAt(0)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>{w.name}</Typography>
                <Typography sx={{ fontSize: 14, color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {w.trade}・{w.qualification}
                </Typography>
              </Box>
              <Chip label={s.label} size="small"
                sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: 14, border: 'none', height: 28, flexShrink: 0 }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

const panels: Record<TabId, React.ReactNode> = {
  sites: <SitesPanel />,
  schedule: <SchedulePanel />,
  workers: <WorkersPanel />,
};

export default function DashboardPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [activeTab, setActiveTab] = useState<TabId>('workers');

  const handleTabChange = (newTab: TabId) => {
    setActiveTab(newTab);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', display: 'flex', flexDirection: 'column', height: isDesktop ? 'calc(100vh - 48px)' : 'calc(100vh - 56px - env(safe-area-inset-bottom) - 16px)' }}>
      {/* Stats bar */}
      <MotionBox {...fadeUp(0.06)} sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '1px solid #f4f4f5',
        px: 2,
        py: 1.25,
        mb: 1.5,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: 19, fontWeight: 700, flexShrink: 0, color: '#18181b' }}>4/1</Typography>
          <WbSunny sx={{ fontSize: 20, color: '#f59e0b' }} />
          <Box sx={{ width: '1px', height: 16, bgcolor: '#f4f4f5', flexShrink: 0 }} />
          <Typography sx={{ fontSize: 19, color: '#a1a1aa', fontWeight: 600, flexShrink: 0 }}>平均進捗</Typography>
          <Box sx={{ height: 6, bgcolor: '#f4f4f5', borderRadius: 3, overflow: 'hidden', width: { xs: 60, md: 120 } }}>
            <Box sx={{ height: '100%', width: `${avgProgress}%`, background: 'linear-gradient(90deg, #ea580c, #fb923c)', borderRadius: 3 }} />
          </Box>
          <Typography sx={{ fontSize: 19, fontWeight: 800, flexShrink: 0 }}>{avgProgress}%</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {[
            { val: sitesData.length, unit: '件', label: '現場', color: '#ea580c' },
            { val: totalWorkers, unit: '人', label: '作業員', color: '#2563eb' },
            { val: delayedCount, unit: '件', label: '遅延', color: delayedCount > 0 ? '#dc2626' : '#16a34a' },
          ].map((stat, i) => (
            <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              {i > 0 && <Box sx={{ width: '1px', height: 16, bgcolor: '#f4f4f5', mr: 0.5 }} />}
              <Typography sx={{ fontSize: 19, color: '#a1a1aa', fontWeight: 600 }}>{stat.label}</Typography>
              <Typography sx={{ fontSize: 19, fontWeight: 800, color: stat.color }}>{stat.val}</Typography>
              <Typography sx={{ fontSize: 19, color: '#71717a', fontWeight: 600 }}>{stat.unit}</Typography>
            </Box>
          ))}
        </Box>
      </MotionBox>

      {/* Tabs — horizontal scroll pill buttons */}
      <MotionBox {...fadeUp(0.12)} sx={{
        display: 'flex',
        gap: 1,
        flexShrink: 0,
        overflowX: 'auto',
        pb: 1.5,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Box
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                cursor: 'pointer',
                flexShrink: 0,
                bgcolor: isActive ? '#18181b' : '#f4f4f5',
                color: isActive ? '#fff' : '#71717a',
                borderRadius: '999px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isActive ? '#18181b' : '#e4e4e7',
                },
              }}
            >
              {tab.icon}
              <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{tab.label}</Typography>
              <Box sx={{
                bgcolor: isActive ? 'rgba(255,255,255,0.2)' : '#e4e4e7',
                color: isActive ? '#fff' : '#a1a1aa',
                borderRadius: '999px',
                px: 0.75,
                fontSize: 13,
                fontWeight: 700,
                lineHeight: '22px',
                minWidth: 22,
                textAlign: 'center',
              }}>
                {tab.count}
              </Box>
            </Box>
          );
        })}
      </MotionBox>

      {/* Tab content */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: '#fff',
        borderRadius: '14px',
        border: '1px solid #f4f4f5',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {panels[activeTab]}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
