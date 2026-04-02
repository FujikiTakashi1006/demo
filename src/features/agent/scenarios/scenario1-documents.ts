import type { ScenarioDefinition } from './types';

const reportHtml = `
<style>
  .rpt {
    font-family: 'Noto Sans JP', -apple-system, sans-serif;
    max-width: 560px;
    margin: 0 auto;
    color: #18181b;
    box-sizing: border-box;
  }
  .rpt *, .rpt *::before, .rpt *::after { box-sizing: border-box; }
  .rpt-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 8px;
  }
  .rpt-head h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .rpt-head .rpt-sub { font-size: 11px; color: #a1a1aa; margin-top: 2px; }
  .rpt-head .rpt-date { text-align: right; white-space: nowrap; flex-shrink: 0; }
  .rpt-head .rpt-date p { margin: 0; font-size: 11px; }
  .rpt-head .rpt-date .day { font-weight: 700; font-size: 12px; }

  /* Stat row */
  .rpt-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }
  @media (min-width: 480px) {
    .rpt-stats { grid-template-columns: repeat(4, 1fr); }
  }
  .rpt-stat {
    background: #fafafa;
    border-radius: 12px;
    padding: 12px 10px;
    text-align: center;
  }
  .rpt-stat .val {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
  }
  .rpt-stat .unit { font-size: 11px; font-weight: 600; color: #71717a; }
  .rpt-stat .lbl { font-size: 10px; color: #a1a1aa; margin-top: 4px; }

  /* Section label */
  .rpt-label {
    font-size: 10px;
    font-weight: 700;
    color: #a1a1aa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 8px;
  }

  /* Gemini-style table */
  .rpt-g-table {
    margin-bottom: 20px;
    font-size: 12px;
  }
  .rpt-g-header, .rpt-g-row {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .rpt-g-header {
    border-bottom: 2px solid #18181b;
    font-weight: 700;
    font-size: 11px;
    color: #71717a;
  }
  .rpt-g-row {
    border-bottom: 1px solid #f4f4f5;
  }
  .rpt-g-row:last-child { border-bottom: none; }
  .rpt-g-col1 { flex: 1; font-weight: 600; min-width: 0; }
  .rpt-g-col2 { width: 48px; text-align: center; font-weight: 700; flex-shrink: 0; }
  .rpt-g-col3 { flex: 1.5; color: #71717a; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @media (max-width: 400px) {
    .rpt-g-col3 { display: none; }
  }

  /* Progress section */
  .rpt-progress {
    margin-bottom: 20px;
  }
  .rpt-pbar-wrap {
    margin-bottom: 10px;
  }
  .rpt-pbar-head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .rpt-pbar-head .name { font-weight: 600; }
  .rpt-pbar-head .pct { font-weight: 800; }
  .rpt-pbar {
    background: #f4f4f5;
    border-radius: 6px;
    height: 8px;
    overflow: hidden;
  }
  .rpt-pbar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.5s ease;
  }

  /* Donut chart */
  .rpt-chart-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin-bottom: 20px;
  }
  @media (min-width: 400px) {
    .rpt-chart-section { flex-direction: row; gap: 16px; }
  }
  .rpt-chart-info {
    flex: 1;
  }
  .rpt-chart-info .rpt-pbar-wrap { margin-bottom: 8px; }

  /* Work items */
  .rpt-work {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .rpt-work-item {
    background: #fafafa;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .rpt-work-num {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: #18181b;
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .rpt-work-body { flex: 1; }
  .rpt-work-body h4 { margin: 0; font-size: 13px; font-weight: 700; }
  .rpt-work-body p { margin: 4px 0 0; font-size: 11px; color: #71717a; line-height: 1.6; }
  .rpt-work-tags { display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap; }
  .rpt-work-tag {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    background: #f4f4f5;
    color: #71717a;
  }

  /* Tags */
  .rpt-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .rpt-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .rpt-tag-ok { background: #f0fdf4; color: #16a34a; }

  /* Material table */
  .rpt-mat {
    margin-bottom: 20px;
  }
  .rpt-mat-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 12px;
    border-bottom: 1px solid #f4f4f5;
  }
  .rpt-mat-row:last-child { border-bottom: none; }
  .rpt-mat-row .name { font-weight: 600; }
  .rpt-mat-row .qty { color: #71717a; }

  /* Tomorrow card */
  .rpt-tomorrow {
    background: #fafafa;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 20px;
  }
  .rpt-tomorrow h3 { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #18181b; }
  .rpt-tomorrow p { margin: 0; font-size: 12px; color: #71717a; }

  /* Footer */
  .rpt-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #a1a1aa;
    padding-top: 12px;
    border-top: 1px solid #f4f4f5;
  }
</style>

<div class="rpt">
  <!-- Header -->
  <div class="rpt-head">
    <div>
      <h2>作業日報</h2>
      <div class="rpt-sub">渋谷再開発プロジェクト A棟</div>
    </div>
    <div class="rpt-date">
      <p class="day">2026.04.01</p>
      <p class="rpt-sub">No. SCR-2026-0401-A</p>
    </div>
  </div>

  <!-- Key stats -->
  <div class="rpt-stats">
    <div class="rpt-stat">
      <div class="val">12</div>
      <div class="lbl">作業員</div>
    </div>
    <div class="rpt-stat">
      <svg width="28" height="28" viewBox="0 0 28 28" style="margin:0 auto 2px">
        <circle cx="14" cy="14" r="6" fill="#fb923c"/>
        <g stroke="#fb923c" stroke-width="1.8" stroke-linecap="round">
          <line x1="14" y1="2" x2="14" y2="5"/>
          <line x1="14" y1="23" x2="14" y2="26"/>
          <line x1="2" y1="14" x2="5" y2="14"/>
          <line x1="23" y1="14" x2="26" y2="14"/>
          <line x1="5.5" y1="5.5" x2="7.6" y2="7.6"/>
          <line x1="20.4" y1="20.4" x2="22.5" y2="22.5"/>
          <line x1="5.5" y1="22.5" x2="7.6" y2="20.4"/>
          <line x1="20.4" y1="7.6" x2="22.5" y2="5.5"/>
        </g>
      </svg>
      <div class="lbl">晴れ</div>
    </div>
    <div class="rpt-stat">
      <div class="val">28<span class="unit">℃</span></div>
      <div class="lbl">最高気温</div>
    </div>
    <div class="rpt-stat">
      <div class="val">0</div>
      <div class="lbl">事故件数</div>
    </div>
  </div>

  <!-- Progress with donut -->
  <div class="rpt-chart-section">
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="32" fill="none" stroke="#f4f4f5" stroke-width="8" />
      <circle cx="40" cy="40" r="32" fill="none" stroke="#ea580c" stroke-width="8"
        stroke-dasharray="${0.78 * 2 * Math.PI * 32} ${2 * Math.PI * 32}"
        stroke-linecap="round"
        transform="rotate(-90 40 40)" />
      <text x="40" y="37" text-anchor="middle" font-size="18" font-weight="800" fill="#18181b">78</text>
      <text x="40" y="49" text-anchor="middle" font-size="9" fill="#a1a1aa">%</text>
    </svg>
    <div class="rpt-chart-info">
      <div class="rpt-label">工事進捗</div>
      <div class="rpt-pbar-wrap">
        <div class="rpt-pbar-head">
          <span class="name">3F 躯体工事</span>
          <span class="pct" style="color:#ea580c">72→78%</span>
        </div>
        <div class="rpt-pbar">
          <div class="rpt-pbar-fill" style="width:78%;background:linear-gradient(90deg,#ea580c,#fb923c)"></div>
        </div>
      </div>
      <div class="rpt-pbar-wrap">
        <div class="rpt-pbar-head">
          <span class="name">全体進捗</span>
          <span class="pct">42%</span>
        </div>
        <div class="rpt-pbar">
          <div class="rpt-pbar-fill" style="width:42%;background:#18181b"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Worker table (Gemini style) -->
  <div class="rpt-label">作業員配置</div>
  <div class="rpt-g-table">
    <div class="rpt-g-header">
      <span class="rpt-g-col1">職種</span>
      <span class="rpt-g-col2">人数</span>
      <span class="rpt-g-col3">担当</span>
    </div>
    <div class="rpt-g-row">
      <span class="rpt-g-col1">型枠工</span>
      <span class="rpt-g-col2">4</span>
      <span class="rpt-g-col3">3F 柱・梁型枠組立</span>
    </div>
    <div class="rpt-g-row">
      <span class="rpt-g-col1">鉄筋工</span>
      <span class="rpt-g-col2">3</span>
      <span class="rpt-g-col3">3F スラブ配筋検査立会</span>
    </div>
    <div class="rpt-g-row">
      <span class="rpt-g-col1">コンクリート工</span>
      <span class="rpt-g-col2">3</span>
      <span class="rpt-g-col3">3F スラブ打設 150㎡</span>
    </div>
    <div class="rpt-g-row">
      <span class="rpt-g-col1">重機OP</span>
      <span class="rpt-g-col2">2</span>
      <span class="rpt-g-col3">ポンプ車・バイブレータ</span>
    </div>
  </div>

  <!-- Work items -->
  <div class="rpt-label">作業内容</div>
  <div class="rpt-work">
    <div class="rpt-work-item">
      <div class="rpt-work-num">1</div>
      <div class="rpt-work-body">
        <h4>3F コンクリート打設</h4>
        <p>スラブ打設 150㎡ / 生コン 45㎥（21-8-20N）<br>8:30開始 → 14:20完了</p>
        <div class="rpt-work-tags">
          <span class="rpt-work-tag">150㎡</span>
          <span class="rpt-work-tag">45㎥</span>
          <span class="rpt-work-tag">TP 6本</span>
        </div>
      </div>
    </div>
    <div class="rpt-work-item">
      <div class="rpt-work-num">2</div>
      <div class="rpt-work-body">
        <h4>3F 柱・梁型枠組立</h4>
        <p>C1〜C4柱型枠建込み完了<br>G1〜G3梁底型枠設置</p>
      </div>
    </div>
    <div class="rpt-work-item">
      <div class="rpt-work-num">3</div>
      <div class="rpt-work-body">
        <h4>3F 配筋検査</h4>
        <p>監理者立会検査 → 合格 / 是正事項なし</p>
      </div>
    </div>
  </div>

  <!-- Safety -->
  <div class="rpt-label">安全管理</div>
  <div class="rpt-tags">
    <span class="rpt-tag rpt-tag-ok">KY活動実施済</span>
    <span class="rpt-tag rpt-tag-ok">災害・事故なし</span>
    <span class="rpt-tag rpt-tag-ok">ヒヤリハット 0件</span>
  </div>

  <!-- Materials -->
  <div class="rpt-label">搬入・使用材料</div>
  <div class="rpt-mat">
    <div class="rpt-mat-row">
      <span class="name">生コンクリート</span>
      <span class="qty">45 ㎥</span>
    </div>
    <div class="rpt-mat-row">
      <span class="name">型枠用合板</span>
      <span class="qty">120 枚</span>
    </div>
    <div class="rpt-mat-row">
      <span class="name">セパレータ・Pコン</span>
      <span class="qty">一式</span>
    </div>
  </div>

  <!-- Tomorrow -->
  <div class="rpt-tomorrow">
    <div class="rpt-label">翌日予定 — 4/2 (水)</div>
    <h3>4F 鉄筋組立（8名予定）</h3>
    <p>鉄筋 D13×200本, D16×80本 / 7:30搬入開始</p>
  </div>

  <div class="rpt-footer">
    <span>AIエージェント自動生成</span>
    <span>2026/04/01 15:30</span>
  </div>
</div>
`;

const scenario: ScenarioDefinition = {
  id: 'documents',
  label: '書類を自動作成',
  iconId: 'description',
  trigger: '今日の日報を作成して',
  keywords: ['日報', '書類', '報告書', '作成して'],
  steps: [
    { type: 'assistant', delay: 800, content: '承知しました。本日の現場データを取得します。' },
    { type: 'tool_call', delay: 1200, toolName: 'site_fetch_data', toolResult: '渋谷再開発 A棟 — 作業員12名、コンクリ打設 3F' },
    { type: 'tool_call', delay: 1200, toolName: 'weather_get_current', toolResult: '晴れ / 最高28℃ / 降水確率10% — 作業影響なし' },
    { type: 'tool_call', delay: 1200, toolName: 'site_fetch_progress', toolResult: '3F躯体工事 72%完了、予定通り' },
    { type: 'tool_call', delay: 1500, toolName: 'doc_generate_report', toolResult: '日報を生成しました' },
    {
      type: 'assistant',
      delay: 800,
      content: '日報が完成しました。',
      artifact: {
        title: '作業日報',
        type: 'document',
        content: reportHtml,
      },
    },
  ],
};

export default scenario;
