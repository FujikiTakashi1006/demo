import { Box, Typography } from '@mui/material';
import { Description, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage, ToolCategory } from '../scenarios/types';

interface Props {
  tools: ChatMessage[];
  artifactTitle?: string;
  onArtifactClick?: () => void;
}

const TOOL_COLOR = '#ea580c';

const toolNameLabels: Record<string, string> = {
  site_fetch_data: '現場データ取得',
  site_fetch_progress: '進捗データ取得',
  site_fetch_records: '施工記録取得',
  site_fetch_schedule: '工程データ取得',
  site_fetch_workers: '作業員データ取得',
  site_fetch_unit_prices: '単価データ取得',
  weather_get_current: '現在の天気取得',
  weather_get_forecast: '天気予報取得',
  doc_generate_report: '日報生成',
  doc_recalculate_schedule: '工程再計算',
  doc_analyze_drawing: '図面解析',
  doc_quantity_takeoff: '数量算出',
  doc_generate_estimate: '見積書生成',
  knowledge_search: 'ナレッジ検索',
  knowledge_rank_similar: '類似度ランキング',
};

const categoryFallback: Record<ToolCategory, string> = {
  site_db: '現場データ',
  weather_api: '天気情報',
  doc_gen: '書類生成',
  knowledge: 'ナレッジ',
};

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block' }}>
      <circle cx="7" cy="7" r="5" fill="none" stroke="rgba(234,88,12,0.2)" strokeWidth="1.5" />
      <motion.circle
        cx="7" cy="7" r="5" fill="none" stroke={TOOL_COLOR} strokeWidth="1.5"
        strokeLinecap="round" strokeDasharray="24 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '7px 7px' }}
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block' }}>
      <motion.circle
        cx="7" cy="7" r="6" fill={TOOL_COLOR}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '7px 7px' }}
      />
      <motion.path
        d="M4 7.2 L6.2 9.2 L10 4.8"
        fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      />
    </svg>
  );
}

function ToolRow({ tool, isActive }: { tool: ChatMessage; isActive: boolean }) {
  const done = tool.toolStatus === 'completed';
  const cat = tool.toolCategory ?? 'site_db';
  const label = (tool.toolName && toolNameLabels[tool.toolName]) || categoryFallback[cat];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box sx={{ py: 0.6, px: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="check" style={{ display: 'flex' }}>
                <CheckMark />
              </motion.div>
            ) : (
              <motion.div
                key="spin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex' }}
              >
                <Spinner />
              </motion.div>
            )}
          </AnimatePresence>
          <Typography sx={{
            fontSize: 12,
            fontWeight: done ? 600 : 700,
            color: done ? '#71717a' : TOOL_COLOR,
            flex: 1,
            transition: 'color 0.3s ease',
          }}>
            {label}
          </Typography>
        </Box>
        <AnimatePresence>
          {isActive && !done && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Box sx={{ ml: '22px', mt: 0.3 }}>
                <Typography sx={{ fontSize: 11, color: '#a1a1aa', lineHeight: 1.4 }}>
                  処理中...
                </Typography>
              </Box>
            </motion.div>
          )}
          {done && tool.toolResult && isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Box sx={{ ml: '22px', mt: 0.3 }}>
                <Typography sx={{ fontSize: 11, color: '#71717a', lineHeight: 1.4 }}>
                  {tool.toolResult}
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}

export default function ToolAccordion({ tools, artifactTitle, onArtifactClick }: Props) {
  let activeIdx = tools.length - 1;
  for (let i = 0; i < tools.length; i++) {
    if (tools[i].toolStatus !== 'completed') {
      activeIdx = i;
      break;
    }
  }

  const allDone = tools.every((t) => t.toolStatus === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box sx={{ ml: { xs: 2, md: 3 }, mb: 1.5 }}>
        <AnimatePresence mode="wait">
          {allDone && artifactTitle && onArtifactClick ? (
            <motion.div
              key="artifact-btn"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Box
                onClick={onArtifactClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': {
                    borderColor: 'rgba(234,88,12,0.3)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  },
                }}
              >
                {/* File icon */}
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  bgcolor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Description sx={{ fontSize: 20, color: '#71717a' }} />
                </Box>
                {/* Title + subtitle */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#18181b', lineHeight: 1.3 }}>
                    {artifactTitle}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#a1a1aa', lineHeight: 1.3, mt: 0.2 }}>
                    クリックして表示
                  </Typography>
                </Box>
                {/* Chevron */}
                <ChevronRight sx={{ fontSize: 18, color: '#a1a1aa', flexShrink: 0 }} />
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="tool-steps"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  border: '1px solid rgba(234,88,12,0.12)',
                  bgcolor: '#fff',
                  overflow: 'hidden',
                  minHeight: 160,
                }}
              >
                <Box sx={{
                  height: 24,
                  bgcolor: 'rgba(234,88,12,0.08)',
                  borderBottom: '1px solid rgba(234,88,12,0.06)',
                }} />
                <Box sx={{ px: 1, py: 0.5 }}>
                  {tools.map((tool, i) => (
                    <ToolRow key={tool.id} tool={tool} isActive={i === activeIdx} />
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}
