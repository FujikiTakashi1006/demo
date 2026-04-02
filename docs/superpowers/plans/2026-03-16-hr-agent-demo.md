# 人材AIエージェントデモ Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 人材業界向けAIエージェントデモ — チャットUIから5つの業務シナリオをモック実行するフロントエンドアプリ

**Architecture:** React SPAのフロントエンドのみ。2画面構成（ダッシュボード + AIエージェント）。シナリオは `ScenarioStep[]` 配列としてハードコードし、タイマーで順次再生。モックデータはJSONファイルで保持。

**Tech Stack:** React 19, TypeScript, Vite 7, MUI 7, React Router DOM 7, MUI DataGrid

**Spec:** `docs/superpowers/specs/2026-03-16-hr-agent-demo-design.md`

---

## Chunk 1: プロジェクト初期化 + レイアウト

### Task 1: Vite + React プロジェクトの作成

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Vite プロジェクトを作成**

既に `docs/` ディレクトリがあるため、一時ディレクトリに作成してからコピーする:

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV
mkdir _tmp_vite && cd _tmp_vite
npm create vite@latest . -- --template react-ts
cp -n package.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html ../hr-agent-demo/
cp -rn src ../hr-agent-demo/
cp -rn public ../hr-agent-demo/
cd .. && rm -rf _tmp_vite
```

- [ ] **Step 2: 依存パッケージをインストール**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @mui/x-data-grid react-router-dom
```

- [ ] **Step 3: 不要ファイルを削除**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
rm -f src/App.css src/index.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 4: 動作確認**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスし、Viteのデフォルト画面が表示されることを確認。確認後 Ctrl+C で停止。

- [ ] **Step 5: git init + 初回コミット**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
git init
echo "node_modules\ndist\n.vite" > .gitignore
git add -A
git commit -m "chore: init vite react-ts project with MUI dependencies"
```

### Task 2: テーマ設定

**Files:**
- Create: `src/theme.ts`

- [ ] **Step 1: MUIテーマを作成**

`src/theme.ts`:
```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
```

- [ ] **Step 2: コミット**

```bash
git add src/theme.ts
git commit -m "feat: add MUI theme configuration"
```

### Task 3: レイアウトコンポーネント（Sidebar + AppLayout）

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Sidebar を作成**

`src/components/layout/Sidebar.tsx`:
```tsx
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import { Dashboard, SmartToy } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const menuItems = [
  { label: 'ダッシュボード', path: '/', icon: <Dashboard /> },
  { label: 'AIエージェント', path: '/agent', icon: <SmartToy /> },
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
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" noWrap fontWeight="bold">
          HR Agent
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
```

- [ ] **Step 2: AppLayout を作成**

`src/components/layout/AppLayout.tsx`:
```tsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
```

- [ ] **Step 3: コミット**

```bash
git add src/components/
git commit -m "feat: add Sidebar and AppLayout components"
```

### Task 4: ルーティング + App エントリポイント

**Files:**
- Create: `src/routes.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: ルーティング定義を作成**

`src/routes.tsx`:
```tsx
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Lazy load pages
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const AgentPage = lazy(() => import('./features/agent/AgentPage'));

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'agent',
        element: (
          <Suspense fallback={<Loading />}>
            <AgentPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
```

- [ ] **Step 2: App.tsx を書き換え**

`src/App.tsx`:
```tsx
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import theme from './theme';
import router from './routes';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: main.tsx を書き換え**

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 4: プレースホルダーページを作成**

`src/features/dashboard/DashboardPage.tsx`:
```tsx
import { Typography } from '@mui/material';

export default function DashboardPage() {
  return <Typography variant="h4">ダッシュボード</Typography>;
}
```

`src/features/agent/AgentPage.tsx`:
```tsx
import { Typography } from '@mui/material';

export default function AgentPage() {
  return <Typography variant="h4">AIエージェント</Typography>;
}
```

- [ ] **Step 5: ビルド確認**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm run build
```

エラーなくビルドが通ることを確認。

- [ ] **Step 6: コミット**

```bash
git add src/
git commit -m "feat: add routing, App entry point, and placeholder pages"
```

---

## Chunk 2: モックデータ + ダッシュボード

### Task 5: モックデータ（JSON）の作成

**Files:**
- Create: `src/data/staffs.json`
- Create: `src/data/jobs.json`
- Create: `src/data/contracts.json`

- [ ] **Step 1: staffs.json を作成**

`src/data/staffs.json`:
```json
[
  { "id": "s1", "name": "田中太郎", "skills": ["仕分け", "フォークリフト"], "status": "working", "currentClient": "物流センターA", "qualifications": ["フォークリフト免許"] },
  { "id": "s2", "name": "佐藤花子", "skills": ["電話対応", "PC操作"], "status": "working", "currentClient": "コールセンター", "qualifications": [] },
  { "id": "s3", "name": "鈴木一郎", "skills": ["電話対応", "英語"], "status": "available", "currentClient": null, "qualifications": ["TOEIC 800"] },
  { "id": "s4", "name": "高橋美咲", "skills": ["イベント", "接客"], "status": "available", "currentClient": null, "qualifications": [] },
  { "id": "s5", "name": "山田一郎", "skills": ["仕分け", "ピッキング"], "status": "expiring", "currentClient": "物流センターA", "qualifications": ["フォークリフト免許"] },
  { "id": "s6", "name": "渡辺美紀", "skills": ["事務", "Excel", "経理"], "status": "expiring", "currentClient": "メーカーD", "qualifications": ["簿記3級"] },
  { "id": "s7", "name": "木村健太", "skills": ["IT", "ヘルプデスク"], "status": "expiring", "currentClient": "SIer F", "qualifications": ["ITパスポート"] },
  { "id": "s8", "name": "中村さくら", "skills": ["接客", "販売"], "status": "expiring", "currentClient": "百貨店G", "qualifications": [] },
  { "id": "s9", "name": "小林直子", "skills": ["経理", "Excel"], "status": "available", "currentClient": null, "qualifications": ["簿記2級"] },
  { "id": "s10", "name": "伊藤恵", "skills": ["経理", "決算"], "status": "available", "currentClient": null, "qualifications": ["簿記1級"] },
  { "id": "s11", "name": "松本翔太", "skills": ["経理"], "status": "available", "currentClient": null, "qualifications": ["簿記2級"] },
  { "id": "s12", "name": "加藤裕子", "skills": ["事務", "経理"], "status": "available", "currentClient": null, "qualifications": ["簿記2級"] },
  { "id": "s13", "name": "吉田勇気", "skills": ["製造", "品質管理"], "status": "working", "currentClient": "製造メーカーJ", "qualifications": [] },
  { "id": "s14", "name": "石井真理", "skills": ["食品加工", "衛生管理"], "status": "working", "currentClient": "食品工場K", "qualifications": ["食品衛生責任者"] },
  { "id": "s15", "name": "藤田浩二", "skills": ["物流", "在庫管理"], "status": "working", "currentClient": "物流センターL", "qualifications": ["フォークリフト免許"] },
  { "id": "s16", "name": "西村あかり", "skills": ["販売", "VMD"], "status": "working", "currentClient": "アパレルM", "qualifications": [] },
  { "id": "s17", "name": "岡田拓也", "skills": ["IT", "プログラミング"], "status": "working", "currentClient": "IT企業N", "qualifications": ["基本情報技術者"] }
]
```

- [ ] **Step 2: jobs.json を作成**

`src/data/jobs.json`:
```json
[
  { "id": "j1", "clientName": "物流センターA", "location": "千葉県船橋市", "requiredCount": 2, "assignedCount": 1, "skills": ["仕分け"], "hourlyRate": 1300, "status": "partially_filled" },
  { "id": "j2", "clientName": "コールセンター", "location": "東京都新宿区", "requiredCount": 3, "assignedCount": 1, "skills": ["電話対応"], "hourlyRate": 1400, "status": "partially_filled" },
  { "id": "j3", "clientName": "イベント会場", "location": "神奈川県横浜市", "requiredCount": 2, "assignedCount": 0, "skills": ["イベント"], "hourlyRate": 1200, "status": "open" },
  { "id": "j4", "clientName": "倉庫B", "location": "埼玉県川口市", "requiredCount": 2, "assignedCount": 2, "skills": ["ピッキング"], "hourlyRate": 1400, "status": "filled" },
  { "id": "j5", "clientName": "メーカーD", "location": "東京都品川区", "requiredCount": 1, "assignedCount": 1, "skills": ["事務"], "hourlyRate": 1350, "status": "filled" },
  { "id": "j6", "clientName": "SIer F", "location": "東京都港区", "requiredCount": 2, "assignedCount": 1, "skills": ["IT", "ヘルプデスク"], "hourlyRate": 1600, "status": "partially_filled" },
  { "id": "j7", "clientName": "百貨店G", "location": "東京都中央区", "requiredCount": 3, "assignedCount": 3, "skills": ["販売", "接客"], "hourlyRate": 1300, "status": "filled" },
  { "id": "j8", "clientName": "株式会社ABC", "location": "東京都千代田区", "requiredCount": 2, "assignedCount": 0, "skills": ["経理", "簿記"], "hourlyRate": 1500, "status": "open" },
  { "id": "j9", "clientName": "製造メーカーJ", "location": "愛知県豊田市", "requiredCount": 3, "assignedCount": 3, "skills": ["製造"], "hourlyRate": 1350, "status": "filled" },
  { "id": "j10", "clientName": "物流C", "location": "千葉県市川市", "requiredCount": 1, "assignedCount": 0, "skills": ["入出庫管理"], "hourlyRate": 1500, "status": "open" }
]
```

- [ ] **Step 3: contracts.json を作成**

シナリオ2用（3月末期限）とシナリオ5用（4月末期限）の両方を含める:

`src/data/contracts.json`:
```json
[
  { "id": "c1", "staffId": "s1", "staffName": "田中太郎", "clientName": "物流センターA", "startDate": "2025-10-01", "endDate": "2026-06-30", "status": "active" },
  { "id": "c2", "staffId": "s2", "staffName": "佐藤花子", "clientName": "コールセンター", "startDate": "2025-12-01", "endDate": "2026-05-31", "status": "active" },
  { "id": "c3", "staffId": "s5", "staffName": "山田一郎", "clientName": "物流センターA", "startDate": "2025-10-01", "endDate": "2026-03-31", "status": "expiring_soon" },
  { "id": "c4", "staffId": "s6", "staffName": "渡辺美紀", "clientName": "メーカーD", "startDate": "2025-10-01", "endDate": "2026-03-31", "status": "expiring_soon" },
  { "id": "c5", "staffId": "s7", "staffName": "木村健太", "clientName": "SIer F", "startDate": "2025-11-01", "endDate": "2026-03-28", "status": "expiring_soon" },
  { "id": "c6", "staffId": "s8", "staffName": "中村さくら", "clientName": "百貨店G", "startDate": "2025-10-01", "endDate": "2026-03-31", "status": "expiring_soon" },
  { "id": "c7", "staffId": "s13", "staffName": "吉田勇気", "clientName": "製造メーカーJ", "startDate": "2025-11-01", "endDate": "2026-04-30", "status": "renewal_pending" },
  { "id": "c8", "staffId": "s14", "staffName": "石井真理", "clientName": "食品工場K", "startDate": "2025-11-01", "endDate": "2026-04-30", "status": "renewal_pending" },
  { "id": "c9", "staffId": "s15", "staffName": "藤田浩二", "clientName": "物流センターL", "startDate": "2025-12-01", "endDate": "2026-04-15", "status": "renewal_pending" },
  { "id": "c10", "staffId": "s16", "staffName": "西村あかり", "clientName": "アパレルM", "startDate": "2025-11-01", "endDate": "2026-04-30", "status": "renewal_pending" },
  { "id": "c11", "staffId": "s17", "staffName": "岡田拓也", "clientName": "IT企業N", "startDate": "2025-11-01", "endDate": "2026-04-30", "status": "renewal_pending" }
]
```

- [ ] **Step 4: コミット**

```bash
git add src/data/
git commit -m "feat: add mock data (staffs, jobs, contracts)"
```

### Task 6: ダッシュボードページ

**Files:**
- Modify: `src/features/dashboard/DashboardPage.tsx`

- [ ] **Step 1: DashboardPage を実装**

`src/features/dashboard/DashboardPage.tsx`:
```tsx
import { Box, Typography, Chip, Paper, Stack, LinearProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import staffsData from '../../data/staffs.json';
import jobsData from '../../data/jobs.json';
import contractsData from '../../data/contracts.json';

const statusLabel: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  working: { label: '稼働中', color: 'success' },
  available: { label: '待機中', color: 'default' },
  expiring: { label: '契約終了間近', color: 'warning' },
  active: { label: '稼働中', color: 'success' },
  renewal_pending: { label: '更新待ち', color: 'warning' },
  expiring_soon: { label: '期限切れ間近', color: 'error' },
  open: { label: '募集中', color: 'error' },
  partially_filled: { label: '一部充足', color: 'warning' },
  filled: { label: '充足', color: 'success' },
};

const staffColumns: GridColDef[] = [
  { field: 'name', headerName: '氏名', width: 120 },
  {
    field: 'skills',
    headerName: 'スキル',
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', py: 0.5 }}>
        {(params.value as string[]).map((s) => (
          <Chip key={s} label={s} size="small" />
        ))}
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: '稼働状況',
    width: 130,
    renderCell: (params) => {
      const s = statusLabel[params.value as string];
      return s ? <Chip label={s.label} color={s.color} size="small" /> : null;
    },
  },
  { field: 'currentClient', headerName: '派遣先', width: 150 },
];

const jobColumns: GridColDef[] = [
  { field: 'clientName', headerName: 'クライアント', width: 150 },
  { field: 'location', headerName: '勤務地', width: 150 },
  { field: 'requiredCount', headerName: '必要人数', width: 90, type: 'number' },
  {
    field: 'fulfillment',
    headerName: '充足率',
    width: 150,
    renderCell: (params) => {
      const row = params.row;
      const rate = row.requiredCount > 0 ? (row.assignedCount / row.requiredCount) * 100 : 0;
      return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            variant="determinate"
            value={rate}
            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            color={rate >= 100 ? 'success' : rate > 0 ? 'warning' : 'error'}
          />
          <Typography variant="caption">{Math.round(rate)}%</Typography>
        </Box>
      );
    },
  },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 120,
    renderCell: (params) => {
      const s = statusLabel[params.value as string];
      return s ? <Chip label={s.label} color={s.color} size="small" /> : null;
    },
  },
];

const contractColumns: GridColDef[] = [
  { field: 'staffName', headerName: 'スタッフ', width: 120 },
  { field: 'clientName', headerName: 'クライアント', width: 150 },
  { field: 'startDate', headerName: '開始日', width: 110 },
  { field: 'endDate', headerName: '終了日', width: 110 },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 130,
    renderCell: (params) => {
      const s = statusLabel[params.value as string];
      return s ? <Chip label={s.label} color={s.color} size="small" /> : null;
    },
  },
];

function countByStatus<T extends { status: string }>(data: T[]) {
  const counts: Record<string, number> = {};
  data.forEach((d) => {
    counts[d.status] = (counts[d.status] || 0) + 1;
  });
  return counts;
}

export default function DashboardPage() {
  const staffCounts = countByStatus(staffsData);
  const jobCounts = countByStatus(jobsData);
  const contractCounts = countByStatus(contractsData);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        ダッシュボード
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1} sx={{ flexWrap: 'wrap' }}>
            <Typography variant="h6">スタッフ一覧</Typography>
            <Chip label={`${staffsData.length}名`} size="small" color="primary" />
            {Object.entries(staffCounts).map(([status, count]) => {
              const s = statusLabel[status];
              return s ? <Chip key={status} label={`${s.label} ${count}`} size="small" color={s.color} variant="outlined" /> : null;
            })}
          </Stack>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={staffsData}
              columns={staffColumns}
              pageSizeOptions={[10]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
              getRowHeight={() => 'auto'}
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1} sx={{ flexWrap: 'wrap' }}>
            <Typography variant="h6">案件一覧</Typography>
            <Chip label={`${jobsData.length}件`} size="small" color="primary" />
            {Object.entries(jobCounts).map(([status, count]) => {
              const s = statusLabel[status];
              return s ? <Chip key={status} label={`${s.label} ${count}`} size="small" color={s.color} variant="outlined" /> : null;
            })}
          </Stack>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={jobsData}
              columns={jobColumns}
              pageSizeOptions={[10]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1} sx={{ flexWrap: 'wrap' }}>
            <Typography variant="h6">契約一覧</Typography>
            <Chip label={`${contractsData.length}件`} size="small" color="primary" />
            {Object.entries(contractCounts).map(([status, count]) => {
              const s = statusLabel[status];
              return s ? <Chip key={status} label={`${s.label} ${count}`} size="small" color={s.color} variant="outlined" /> : null;
            })}
          </Stack>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={contractsData}
              columns={contractColumns}
              pageSizeOptions={[10]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
            />
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
```

- [ ] **Step 2: ビルド確認**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm run build
```

- [ ] **Step 3: コミット**

```bash
git add src/features/dashboard/
git commit -m "feat: implement Dashboard page with staff, jobs, contracts tables"
```

---

## Chunk 3: シナリオエンジン（types + useScenarioPlayer + シナリオ登録）

### Task 7: シナリオの型定義

**Files:**
- Create: `src/features/agent/scenarios/types.ts`

- [ ] **Step 1: 型定義を作成**

`src/features/agent/scenarios/types.ts`:
```typescript
export type MessageType = 'user' | 'assistant' | 'tool_call';
export type ToolStatus = 'running' | 'completed';
export type ToolCategory = 'db' | 'email' | 'calendar' | 'file';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  toolName?: string;
  toolCategory?: ToolCategory;
  toolStatus?: ToolStatus;
  toolResult?: string;
}

export interface ScenarioStep {
  type: MessageType;
  delay: number; // ms before this step appears
  content?: string;
  toolName?: string;
  toolResult?: string;
}

export interface ScenarioDefinition {
  id: string;
  label: string; // チップに表示するラベル
  trigger: string; // チップクリック時に送信するテキスト
  keywords: string[]; // キーワードマッチ用
  steps: ScenarioStep[];
}

/**
 * ツール名のプレフィックスからカテゴリを判定
 */
export function getToolCategory(toolName: string): ToolCategory {
  if (toolName.startsWith('db_')) return 'db';
  if (toolName.startsWith('email_')) return 'email';
  if (toolName.startsWith('calendar_')) return 'calendar';
  if (toolName.startsWith('file_')) return 'file';
  return 'db'; // fallback
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/scenarios/types.ts
git commit -m "feat: add scenario type definitions with tool category detection"
```

### Task 8: 5つのシナリオ定義

**Files:**
- Create: `src/features/agent/scenarios/scenario1-fulfillment.ts`
- Create: `src/features/agent/scenarios/scenario2-followup.ts`
- Create: `src/features/agent/scenarios/scenario3-client.ts`
- Create: `src/features/agent/scenarios/scenario4-attendance.ts`
- Create: `src/features/agent/scenarios/scenario5-contract.ts`

- [ ] **Step 1: シナリオ1（案件充足）を作成**

`src/features/agent/scenarios/scenario1-fulfillment.ts`:
```typescript
import { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'fulfillment',
  label: '案件充足の自動化',
  trigger: '来週充足率が低い案件を調べて、マッチするスタッフをアサインして',
  keywords: ['充足', 'アサイン', 'マッチ'],
  steps: [
    { type: 'assistant', delay: 1000, content: '承知しました。来週の案件と充足率を確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_jobs', toolResult: '来週の案件15件を取得。充足率50%未満が3件' },
    { type: 'assistant', delay: 1000, content: '充足率が低い3件を特定しました。条件にマッチするスタッフを検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_staff', toolResult: '条件に合う待機中スタッフ6名を抽出' },
    { type: 'tool_call', delay: 1500, toolName: 'db_assign_staff', toolResult: '3件の案件に4名をアサイン' },
    {
      type: 'assistant',
      delay: 1000,
      content: `以下の案件にスタッフをアサインしました。

■ 物流センターA 仕分け作業（千葉県船橋市）
  → 田中太郎をアサイン｜充足率 50% → 100%

■ コールセンター 受電業務（東京都新宿区）
  → 佐藤花子、鈴木一郎をアサイン｜充足率 33% → 100%

■ イベント会場 設営補助（神奈川県横浜市）
  → 高橋美咲をアサイン｜充足率 0% → 50%

合計3件の案件に対し、4名のスタッフをアサインしました。`,
    },
  ],
};

export default scenario;
```

- [ ] **Step 2: シナリオ2（フォローアップ）を作成**

`src/features/agent/scenarios/scenario2-followup.ts`:
```typescript
import { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'followup',
  label: 'スタッフフォローアップ',
  trigger: '今月末で契約切れるスタッフのフォローお願い',
  keywords: ['フォロー', '契約切れ', '契約終了', '期限切れ', '次の案件'],
  steps: [
    { type: 'assistant', delay: 1000, content: '今月末で契約終了のスタッフを確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_expiring_contracts', toolResult: '3月末終了の契約4件（スタッフ4名）を検出' },
    { type: 'assistant', delay: 1000, content: '4名のスタッフの契約が今月末で終了します。次の案件候補を検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_jobs', toolResult: '各スタッフのスキルに合う案件候補を計8件抽出' },
    { type: 'tool_call', delay: 1500, toolName: 'email_send_draft', toolResult: '4名分のフォローメールドラフトを作成' },
    {
      type: 'assistant',
      delay: 1000,
      content: `フォロー対象のスタッフと次の案件候補をまとめました。

■ 山田一郎（3/31契約終了・フォークリフト資格）
  候補案件: 倉庫B ピッキング作業（時給1,400円）、物流C 入出庫管理（時給1,500円）
  → フォローメールを作成しました

■ 渡辺美紀（3/31契約終了・事務経験5年）
  候補案件: メーカーD 営業事務（時給1,350円）、商社E 受発注業務（時給1,400円）
  → フォローメールを作成しました

■ 木村健太（3/28契約終了・IT系スキル）
  候補案件: SIer F ヘルプデスク（時給1,600円）
  → フォローメールを作成しました

■ 中村さくら（3/31契約終了・接客経験）
  候補案件: 百貨店G 販売スタッフ（時給1,300円）、ホテルH フロント（時給1,350円）
  → フォローメールを作成しました`,
    },
  ],
};

export default scenario;
```

- [ ] **Step 3: シナリオ3（クライアント対応）を作成**

`src/features/agent/scenarios/scenario3-client.ts`:
```typescript
import { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'client',
  label: 'クライアント対応',
  trigger: '新着メールの依頼を確認して、候補スタッフの提案書を作って',
  keywords: ['依頼', '提案書', '新着メール'],
  steps: [
    { type: 'assistant', delay: 1000, content: '新着メールを確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'email_read_inbox', toolResult: '未読メール3件。うち人材依頼が1件' },
    { type: 'assistant', delay: 1000, content: '株式会社ABCから経理スタッフ2名の依頼です。条件にマッチするスタッフを検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_staff', toolResult: '経理経験のある待機中スタッフ4名を抽出' },
    { type: 'tool_call', delay: 1500, toolName: 'file_save_proposal', toolResult: '提案書を作成し共有フォルダに保存' },
    {
      type: 'assistant',
      delay: 1000,
      content: `候補スタッフの提案書を作成しました。

■ 依頼内容（株式会社ABC 人事部 佐々木様）
  「経理スタッフ2名、4月1日から6ヶ月、簿記2級以上希望」

■ 候補スタッフ
  1. 小林直子（簿記2級・経理3年）★おすすめ
  2. 伊藤恵（簿記1級・経理5年）★おすすめ
  3. 松本翔太（簿記2級・経理1年）
  4. 加藤裕子（簿記2級・一般事務3年→経理半年）

■ 提案書を保存しました
  → //shared/proposals/ABC_経理スタッフ提案書_20260316.pdf`,
    },
  ],
};

export default scenario;
```

- [ ] **Step 4: シナリオ4（勤怠異常）を作成**

`src/features/agent/scenarios/scenario4-attendance.ts`:
```typescript
import { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'attendance',
  label: '勤怠異常検知→対応',
  trigger: '今週の勤怠で異常があれば対応して',
  keywords: ['勤怠', '異常', '出勤', '欠勤'],
  steps: [
    { type: 'assistant', delay: 1000, content: '今週の勤怠データを確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_attendance', toolResult: '今週の勤怠レコード156件をチェック。異常3件を検出' },
    { type: 'assistant', delay: 1000, content: '3件の勤怠異常を検出しました。対応を進めます。' },
    { type: 'tool_call', delay: 1500, toolName: 'email_send_notification', toolResult: '該当スタッフ3名に確認メールを送信' },
    { type: 'tool_call', delay: 1500, toolName: 'calendar_create_event', toolResult: '上長との面談予定を3件登録' },
    {
      type: 'assistant',
      delay: 1000,
      content: `勤怠異常への対応が完了しました。

■ 勤怠異常レポート

1. 田中太郎（物流センターA）
   異常: 3/13(木) 無断欠勤
   → 確認メールを送信済み
   → 面談予定: 3/17(月) 10:00 上長・鈴木マネージャー

2. 佐藤花子（コールセンター）
   異常: 3/11(火)-3/12(水) 残業時間超過（1日5時間超）
   → 確認メールを送信済み
   → 面談予定: 3/17(月) 14:00 上長・鈴木マネージャー

3. 高橋美咲（イベント会場）
   異常: 3/10(月) 打刻漏れ（退勤未記録）
   → 確認メールを送信済み
   → 面談予定: 3/18(火) 11:00 上長・山本リーダー`,
    },
  ],
};

export default scenario;
```

- [ ] **Step 5: シナリオ5（契約更新）を作成**

`src/features/agent/scenarios/scenario5-contract.ts`:
```typescript
import { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'contract',
  label: '契約更新業務',
  trigger: '来月期限の契約をまとめて更新手続きして',
  keywords: ['契約更新', '更新手続き', '更新書類'],
  steps: [
    { type: 'assistant', delay: 1000, content: '来月期限の契約を検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_expiring_contracts', toolResult: '4月末期限の契約5件を検出' },
    { type: 'assistant', delay: 1000, content: '5件の契約更新が必要です。更新書類を作成します。' },
    { type: 'tool_call', delay: 1500, toolName: 'file_generate_document', toolResult: '5件の契約更新書類を生成・保存' },
    { type: 'tool_call', delay: 1500, toolName: 'calendar_create_event', toolResult: '署名日程を5件登録' },
    {
      type: 'assistant',
      delay: 1000,
      content: `契約更新の手続きが完了しました。

■ 契約更新スケジュール

1. 吉田勇気 × 製造メーカーJ（4/30期限）
   更新書類: //shared/contracts/renewal_yoshida_20260401.pdf
   署名日程: 3/25(水) 15:00

2. 石井真理 × 食品工場K（4/30期限）
   更新書類: //shared/contracts/renewal_ishii_20260401.pdf
   署名日程: 3/26(木) 10:00

3. 藤田浩二 × 物流センターL（4/15期限）
   更新書類: //shared/contracts/renewal_fujita_20260401.pdf
   署名日程: 3/24(月) 13:00

4. 西村あかり × アパレルM（4/30期限）
   更新書類: //shared/contracts/renewal_nishimura_20260401.pdf
   署名日程: 3/27(金) 11:00

5. 岡田拓也 × IT企業N（4/30期限）
   更新書類: //shared/contracts/renewal_okada_20260401.pdf
   署名日程: 3/26(木) 14:00`,
    },
  ],
};

export default scenario;
```

- [ ] **Step 6: コミット**

```bash
git add src/features/agent/scenarios/scenario*.ts
git commit -m "feat: add 5 scenario definitions (fulfillment, followup, client, attendance, contract)"
```

### Task 9: シナリオ登録 + キーワードマッチロジック

**Files:**
- Create: `src/features/agent/scenarios/index.ts`

- [ ] **Step 1: index.ts を作成**

`src/features/agent/scenarios/index.ts`:
```typescript
import { ScenarioDefinition } from './types';
import scenario1 from './scenario1-fulfillment';
import scenario2 from './scenario2-followup';
import scenario3 from './scenario3-client';
import scenario4 from './scenario4-attendance';
import scenario5 from './scenario5-contract';

// 優先順に並べる（上から順に評価し、最初にマッチしたシナリオを実行）
export const scenarios: ScenarioDefinition[] = [
  scenario1,
  scenario2,
  scenario3,
  scenario4,
  scenario5,
];

/**
 * ユーザー入力テキストからマッチするシナリオを検索
 * 優先順に評価し、最初にキーワードがマッチしたシナリオを返す
 */
export function findScenario(input: string): ScenarioDefinition | null {
  for (const scenario of scenarios) {
    if (scenario.keywords.some((kw) => input.includes(kw))) {
      return scenario;
    }
  }
  return null;
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/scenarios/index.ts
git commit -m "feat: add scenario registry with keyword matching"
```

### Task 10: useScenarioPlayer フック

**Files:**
- Create: `src/features/agent/useScenarioPlayer.ts`

- [ ] **Step 1: useScenarioPlayer を実装**

`src/features/agent/useScenarioPlayer.ts`:
```typescript
import { useState, useRef, useCallback } from 'react';
import { ChatMessage, ScenarioStep, getToolCategory } from './scenarios/types';
import { findScenario } from './scenarios';

export function useScenarioPlayer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idCounterRef = useRef(0);

  const nextId = useCallback(() => `msg-${++idCounterRef.current}`, []);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const playScenario = useCallback(
    (userMessage: string) => {
      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: nextId(), type: 'user', content: userMessage },
      ]);

      // Find matching scenario
      const scenario = findScenario(userMessage);
      if (!scenario) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            type: 'assistant',
            content:
              '申し訳ありません。以下のシナリオから選択してください。',
          },
        ]);
        return null; // signal no match
      }

      setIsPlaying(true);
      clearTimeouts();

      let cumulativeDelay = 0;

      scenario.steps.forEach((step: ScenarioStep) => {
        cumulativeDelay += step.delay;

        if (step.type === 'tool_call') {
          // Show running state
          const toolMsgId = nextId();
          const runningTimeout = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: toolMsgId,
                type: 'tool_call',
                toolName: step.toolName,
                toolCategory: step.toolName
                  ? getToolCategory(step.toolName)
                  : undefined,
                toolStatus: 'running',
              },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(runningTimeout);

          // Transition to completed after 1000ms
          cumulativeDelay += 1000;
          const completedTimeout = setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === toolMsgId
                  ? { ...msg, toolStatus: 'completed' as const, toolResult: step.toolResult }
                  : msg,
              ),
            );
          }, cumulativeDelay);
          timeoutsRef.current.push(completedTimeout);
        } else {
          const timeout = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { id: nextId(), type: step.type, content: step.content },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(timeout);
        }
      });

      // Mark playing as done after all steps
      cumulativeDelay += 500;
      const doneTimeout = setTimeout(() => {
        setIsPlaying(false);
      }, cumulativeDelay);
      timeoutsRef.current.push(doneTimeout);

      return scenario;
    },
    [clearTimeouts],
  );

  const resetChat = useCallback(() => {
    clearTimeouts();
    setMessages([]);
    setIsPlaying(false);
    idCounterRef.current = 0;
  }, [clearTimeouts]);

  return { messages, isPlaying, playScenario, resetChat };
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/useScenarioPlayer.ts
git commit -m "feat: implement useScenarioPlayer hook with multi-scenario support"
```

---

## Chunk 4: チャットUIコンポーネント + AgentPage

### Task 11: ChatMessage コンポーネント

**Files:**
- Create: `src/features/agent/components/ChatMessage.tsx`

- [ ] **Step 1: ChatMessage を実装**

`src/features/agent/components/ChatMessage.tsx`:
```tsx
import { Box, Paper, Avatar, Typography } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import { ChatMessage as ChatMessageType } from '../scenarios/types';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.type === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: 'grey.400', mr: 1, width: 32, height: 32 }}>
          <SmartToy fontSize="small" />
        </Avatar>
      )}
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1,
          maxWidth: '75%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: isUser
            ? '16px 16px 4px 16px'
            : '16px 16px 16px 4px',
        }}
      >
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
        >
          {message.content}
        </Typography>
      </Paper>
      {isUser && (
        <Avatar sx={{ bgcolor: 'primary.main', ml: 1, width: 32, height: 32 }}>
          <Person fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/components/ChatMessage.tsx
git commit -m "feat: add ChatMessage component"
```

### Task 12: ToolExecution コンポーネント

**Files:**
- Create: `src/features/agent/components/ToolExecution.tsx`

- [ ] **Step 1: ToolExecution を実装**

`src/features/agent/components/ToolExecution.tsx`:
```tsx
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  CheckCircle,
  Storage,
  Email,
  CalendarMonth,
  FolderOpen,
} from '@mui/icons-material';
import { ChatMessage, ToolCategory } from '../scenarios/types';

interface Props {
  message: ChatMessage;
}

const categoryConfig: Record<
  ToolCategory,
  { icon: typeof Storage; color: string; bgColor: string }
> = {
  db: { icon: Storage, color: '#1976d2', bgColor: '#e3f2fd' },
  email: { icon: Email, color: '#2e7d32', bgColor: '#e8f5e9' },
  calendar: { icon: CalendarMonth, color: '#ed6c02', bgColor: '#fff3e0' },
  file: { icon: FolderOpen, color: '#9c27b0', bgColor: '#f3e5f5' },
};

export default function ToolExecution({ message }: Props) {
  const isCompleted = message.toolStatus === 'completed';
  const category = message.toolCategory ?? 'db';
  const config = categoryConfig[category];
  const CategoryIcon = config.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 1.5,
        ml: 5, // align with assistant messages (after avatar)
      }}
    >
      <Box
        sx={{
          border: 1,
          borderColor: isCompleted ? config.color : 'grey.300',
          borderRadius: 2,
          px: 2,
          py: 1,
          bgcolor: isCompleted ? config.bgColor : 'transparent',
          minWidth: 280,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon sx={{ fontSize: 18, color: config.color }} />
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
          >
            {message.toolName}
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isCompleted ? (
              <CheckCircle sx={{ fontSize: 18, color: config.color }} />
            ) : (
              <>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  実行中...
                </Typography>
              </>
            )}
          </Box>
        </Box>
        {isCompleted && message.toolResult && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {message.toolResult}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/components/ToolExecution.tsx
git commit -m "feat: add ToolExecution component with category icons"
```

### Task 13: ChatInput コンポーネント

**Files:**
- Create: `src/features/agent/components/ChatInput.tsx`

- [ ] **Step 1: ChatInput を実装**

チップクリック時は親から `pendingText` を受け取り、入力欄にテキストを表示してから自動送信する（ユーザーが入力したように見せる）。

`src/features/agent/components/ChatInput.tsx`:
```tsx
import { useState, useEffect, KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  pendingText?: string; // チップクリック時に親からセットされる
}

export default function ChatInput({ onSend, disabled, pendingText }: Props) {
  const [input, setInput] = useState('');

  // チップクリック時: テキストを入力欄に表示→300ms後に自動送信
  useEffect(() => {
    if (pendingText) {
      setInput(pendingText);
      const timer = setTimeout(() => {
        onSend(pendingText);
        setInput('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingText, onSend]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="メッセージを入力..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size="small"
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      >
        <Send />
      </IconButton>
    </Box>
  );
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/components/ChatInput.tsx
git commit -m "feat: add ChatInput component"
```

### Task 14: ScenarioChips コンポーネント

**Files:**
- Create: `src/features/agent/components/ScenarioChips.tsx`

- [ ] **Step 1: ScenarioChips を実装**

`src/features/agent/components/ScenarioChips.tsx`:
```tsx
import { Stack, Chip } from '@mui/material';
import { scenarios } from '../scenarios';

interface Props {
  onSelect: (trigger: string) => void;
  disabled?: boolean;
}

export default function ScenarioChips({ onSelect, disabled }: Props) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {scenarios.map((s) => (
        <Chip
          key={s.id}
          label={s.label}
          onClick={() => onSelect(s.trigger)}
          disabled={disabled}
          color="primary"
          variant="outlined"
          clickable
        />
      ))}
    </Stack>
  );
}
```

- [ ] **Step 2: コミット**

```bash
git add src/features/agent/components/ScenarioChips.tsx
git commit -m "feat: add ScenarioChips component"
```

### Task 15: AgentPage（メインページ）

**Files:**
- Modify: `src/features/agent/AgentPage.tsx`

- [ ] **Step 1: AgentPage を実装**

`src/features/agent/AgentPage.tsx`:
```tsx
import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Stack } from '@mui/material';
import { SmartToy, RestartAlt } from '@mui/icons-material';
import { useScenarioPlayer } from './useScenarioPlayer';
import ChatMessage from './components/ChatMessage';
import ToolExecution from './components/ToolExecution';
import ChatInput from './components/ChatInput';
import ScenarioChips from './components/ScenarioChips';

export default function AgentPage() {
  const { messages, isPlaying, playScenario, resetChat } = useScenarioPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingText, setPendingText] = useState<string | undefined>();

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    setPendingText(undefined);
    playScenario(text);
  };

  const handleChipSelect = (trigger: string) => {
    // 同じチップの連打に対応: 一度クリアしてからセット
    setPendingText(undefined);
    setTimeout(() => setPendingText(trigger), 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <SmartToy color="primary" />
        <Typography variant="h5" fontWeight="bold">
          AIエージェント
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={resetChat} size="small" title="リセット">
          <RestartAlt />
        </IconButton>
      </Stack>

      {/* Scenario Chips */}
      <Box sx={{ mb: 2 }}>
        <ScenarioChips onSelect={handleChipSelect} disabled={isPlaying} />
      </Box>

      {/* Messages Area */}
      <Paper
        ref={scrollRef}
        elevation={0}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'white',
          border: 1,
          borderColor: 'grey.200',
          borderRadius: 2,
          mb: 2,
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <SmartToy sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
            <Typography variant="body2">
              上のシナリオを選択するか、メッセージを入力してください
            </Typography>
          </Box>
        )}
        {messages.map((msg) =>
          msg.type === 'tool_call' ? (
            <ToolExecution key={msg.id} message={msg} />
          ) : (
            <ChatMessage key={msg.id} message={msg} />
          ),
        )}
      </Paper>

      {/* Input Area */}
      <ChatInput onSend={handleSend} disabled={isPlaying} pendingText={pendingText} />
    </Box>
  );
}
```

- [ ] **Step 2: ビルド確認**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm run build
```

- [ ] **Step 3: 動作確認**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm run dev
```

ブラウザで確認:
1. `http://localhost:5173/` — ダッシュボードにスタッフ・案件・契約テーブルが表示される
2. `http://localhost:5173/agent` — 5つのシナリオチップが表示される
3. チップをクリック → シナリオが自動再生される（ツール実行アニメーション付き）
4. サイドバーで画面切り替えができる

- [ ] **Step 4: コミット**

```bash
git add src/features/agent/
git commit -m "feat: implement AgentPage with chat UI and scenario playback"
```

---

## Chunk 5: 最終調整

### Task 16: index.html のタイトル更新

**Files:**
- Modify: `index.html`

- [ ] **Step 1: タイトルを変更**

`index.html` の `<title>` を `HR Agent Demo` に変更。

- [ ] **Step 2: 最終ビルド確認**

```bash
cd /Users/hig-hir/Documents/AICE/開発/DEV/hr-agent-demo
npm run build
```

- [ ] **Step 3: コミット**

```bash
git add index.html
git commit -m "chore: update page title to HR Agent Demo"
```
