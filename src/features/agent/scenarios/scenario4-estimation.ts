import type { ScenarioDefinition } from './types';

const estimateHtml = `
<style>
  .est {
    font-family: 'Noto Sans JP', -apple-system, sans-serif;
    max-width: 560px;
    margin: 0 auto;
    color: #18181b;
    overflow: hidden;
    box-sizing: border-box;
  }
  .est *, .est *::before, .est *::after { box-sizing: border-box; }

  /* Header */
  .est-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .est-head h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .est-head .est-sub { font-size: 11px; color: #a1a1aa; margin-top: 2px; }
  .est-head .est-date { text-align: right; }
  .est-head .est-date p { margin: 0; font-size: 12px; }
  .est-head .est-date .day { font-weight: 700; font-size: 13px; }

  /* Stats */
  .est-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 22px;
  }
  @media (min-width: 480px) {
    .est-stats { grid-template-columns: repeat(4, 1fr); }
  }
  .est-stat {
    background: #fafafa;
    border-radius: 12px;
    padding: 12px 10px;
    text-align: center;
  }
  .est-stat .val {
    font-size: 18px;
    font-weight: 800;
    line-height: 1;
  }
  .est-stat .val .unit { font-size: 10px; font-weight: 600; color: #71717a; }
  .est-stat .lbl { font-size: 10px; color: #a1a1aa; margin-top: 5px; }

  /* Section label */
  .est-label {
    font-size: 10px;
    font-weight: 700;
    color: #a1a1aa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 8px;
  }

  /* Chart section */
  .est-chart-section {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 22px;
  }
  .est-chart-info {
    flex: 1;
  }
  .est-breakdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    font-size: 12px;
  }
  .est-breakdown-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .est-breakdown-name { flex: 1; font-weight: 500; color: #71717a; }
  .est-breakdown-val { font-weight: 700; }

  /* Table */
  .est-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 22px;
    max-width: 100%;
  }
  .est-table {
    width: 100%;
    min-width: 380px;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 11px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #f4f4f5;
  }
  .est-table th {
    background: #fafafa;
    padding: 8px 12px;
    text-align: left;
    font-weight: 700;
    font-size: 11px;
    color: #71717a;
  }
  .est-table th.r { text-align: right; }
  .est-table td {
    padding: 10px 12px;
    border-top: 1px solid #f4f4f5;
  }
  .est-table td.name { font-weight: 600; white-space: nowrap; width: 1%; }
  .est-table td.r { text-align: right; }
  .est-table td.amt { text-align: right; font-weight: 600; }
  .est-table tr:nth-child(even) td { background: #fafcfc; }

  /* Totals */
  .est-totals {
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 22px;
  }
  .est-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    font-size: 13px;
  }
  .est-total-row .label { color: #71717a; font-weight: 600; }
  .est-total-row .amount { font-weight: 700; }
  .est-total-sub {
    background: #fafafa;
  }
  .est-total-tax {
    background: #fafafa;
    border-top: 1px solid #f4f4f5;
    font-size: 12px;
  }
  .est-total-main {
    background: #fafafa;
    border-top: 2px solid #18181b;
    padding: 16px;
  }
  .est-total-main .label {
    color: #71717a;
    font-weight: 700;
    font-size: 12px;
  }
  .est-total-main .amount {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #18181b;
  }

  /* Note */
  .est-note {
    font-size: 12px;
    color: #71717a;
    line-height: 1.6;
    padding: 12px 14px;
    background: #fafafa;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  /* Footer */
  .est-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #a1a1aa;
    padding-top: 12px;
    border-top: 1px solid #f4f4f5;
  }
</style>

<div class="est">
  <!-- Header -->
  <div class="est-head">
    <div>
      <h2>概算見積書</h2>
      <div class="est-sub">RC造3階建 オフィスビル / 東京都</div>
    </div>
    <div class="est-date">
      <p class="day">2026.04.01</p>
      <p class="est-sub">No. EST-2026-0401</p>
    </div>
  </div>

  <!-- Stats -->
  <div class="est-stats">
    <div class="est-stat">
      <div class="val">RC<span class="unit">造</span></div>
      <div class="lbl">構造</div>
    </div>
    <div class="est-stat">
      <div class="val">3<span class="unit">階</span></div>
      <div class="lbl">階数</div>
    </div>
    <div class="est-stat">
      <div class="val">2,400<span class="unit">㎡</span></div>
      <div class="lbl">延床面積</div>
    </div>
    <div class="est-stat">
      <div class="val">9<span class="unit">種</span></div>
      <div class="lbl">工種数</div>
    </div>
  </div>

  <!-- Donut + Breakdown -->
  <div class="est-label">コスト構成比</div>
  <div class="est-chart-section">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <!-- segments: struct 41%, equip 27%, exterior 15%, temp 9%, overhead 11% (approx of 196M) -->
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f4f4f5" stroke-width="12" />
      <!-- Structural (concrete+rebar+formwork+steel) = 75.6M = ~39% -->
      <circle cx="50" cy="50" r="38" fill="none" stroke="#ea580c" stroke-width="12"
        stroke-dasharray="${0.386 * 2 * Math.PI * 38} ${2 * Math.PI * 38}"
        stroke-linecap="round" transform="rotate(-90 50 50)" />
      <!-- Equipment = 52M = ~27% -->
      <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" stroke-width="12"
        stroke-dasharray="${0.265 * 2 * Math.PI * 38} ${2 * Math.PI * 38}"
        stroke-linecap="round" transform="rotate(${-90 + 0.386 * 360} 50 50)" />
      <!-- Exterior = 28.8M = ~15% -->
      <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" stroke-width="12"
        stroke-dasharray="${0.147 * 2 * Math.PI * 38} ${2 * Math.PI * 38}"
        stroke-linecap="round" transform="rotate(${-90 + 0.651 * 360} 50 50)" />
      <!-- Temp = 18M = ~9% -->
      <circle cx="50" cy="50" r="38" fill="none" stroke="#71717a" stroke-width="12"
        stroke-dasharray="${0.092 * 2 * Math.PI * 38} ${2 * Math.PI * 38}"
        stroke-linecap="round" transform="rotate(${-90 + 0.798 * 360} 50 50)" />
      <text x="50" y="46" text-anchor="middle" font-size="16" font-weight="800" fill="#18181b">1.96</text>
      <text x="50" y="59" text-anchor="middle" font-size="9" fill="#a1a1aa">億円</text>
    </svg>
    <div class="est-chart-info">
      <div class="est-breakdown-item">
        <div class="est-breakdown-dot" style="background:#ea580c"></div>
        <span class="est-breakdown-name">躯体工事</span>
        <span class="est-breakdown-val">¥75,565,000</span>
      </div>
      <div class="est-breakdown-item">
        <div class="est-breakdown-dot" style="background:#3b82f6"></div>
        <span class="est-breakdown-name">設備工事</span>
        <span class="est-breakdown-val">¥52,000,000</span>
      </div>
      <div class="est-breakdown-item">
        <div class="est-breakdown-dot" style="background:#8b5cf6"></div>
        <span class="est-breakdown-name">外装工事</span>
        <span class="est-breakdown-val">¥28,800,000</span>
      </div>
      <div class="est-breakdown-item">
        <div class="est-breakdown-dot" style="background:#71717a"></div>
        <span class="est-breakdown-name">仮設・諸経費</span>
        <span class="est-breakdown-val">¥39,635,000</span>
      </div>
    </div>
  </div>

  <!-- Detail table -->
  <div class="est-label">工種別明細</div>
  <div class="est-table-wrap">
  <table class="est-table">
    <tr>
      <th>工種</th>
      <th class="r">数量</th>
      <th class="r">単価</th>
      <th class="r">金額</th>
    </tr>
    <tr>
      <td class="name">コンクリート工事</td>
      <td class="r">850㎥</td>
      <td class="r">¥18,500</td>
      <td class="amt">¥15,725,000</td>
    </tr>
    <tr>
      <td class="name">鉄筋工事</td>
      <td class="r">120t</td>
      <td class="r">¥95,000</td>
      <td class="amt">¥11,400,000</td>
    </tr>
    <tr>
      <td class="name">型枠工事</td>
      <td class="r">3,200㎡</td>
      <td class="r">¥4,200</td>
      <td class="amt">¥13,440,000</td>
    </tr>
    <tr>
      <td class="name">鉄骨工事</td>
      <td class="r">280t</td>
      <td class="r">¥125,000</td>
      <td class="amt">¥35,000,000</td>
    </tr>
    <tr>
      <td class="name">外装工事</td>
      <td class="r">一式</td>
      <td class="r">—</td>
      <td class="amt">¥28,800,000</td>
    </tr>
    <tr>
      <td class="name">設備工事</td>
      <td class="r">一式</td>
      <td class="r">—</td>
      <td class="amt">¥52,000,000</td>
    </tr>
    <tr>
      <td class="name">仮設工事</td>
      <td class="r">一式</td>
      <td class="r">—</td>
      <td class="amt">¥18,000,000</td>
    </tr>
    <tr>
      <td class="name">諸経費</td>
      <td class="r">一式</td>
      <td class="r">—</td>
      <td class="amt">¥21,635,000</td>
    </tr>
  </table>
  </div>

  <!-- Totals -->
  <div class="est-totals">
    <div class="est-total-row est-total-sub">
      <span class="label">小計（税抜）</span>
      <span class="amount">¥196,000,000</span>
    </div>
    <div class="est-total-row est-total-tax">
      <span class="label">消費税（10%）</span>
      <span class="amount">¥19,600,000</span>
    </div>
    <div class="est-total-row est-total-main">
      <span class="label">合計（税込）</span>
      <span class="amount">¥215,600,000</span>
    </div>
  </div>

  <!-- Note -->
  <div class="est-note">
    ※ 2026年4月 東京都公共工事設計労務単価に基づく概算。<br>
    ※ 詳細積算は図面精査後に算出。地盤改良・杭工事は別途。
  </div>

  <div class="est-footer">
    <span>AIエージェント自動生成</span>
    <span>2026/04/01 16:00</span>
  </div>
</div>
`;

const scenario: ScenarioDefinition = {
  id: 'estimation',
  label: '積算・見積作成',
  iconId: 'payments',
  trigger: 'この図面で積算して',
  keywords: ['積算', '見積', '図面', '概算'],
  attachment: { name: '設計図面_RC造オフィスビル.pdf', size: '4.2 MB' },
  steps: [
    { type: 'assistant', delay: 800, content: '図面を解析します。' },
    { type: 'tool_call', delay: 1500, toolName: 'doc_analyze_drawing', toolResult: 'RC造3階建 オフィスビル、延床面積2,400㎡' },
    { type: 'tool_call', delay: 1500, toolName: 'doc_quantity_takeoff', toolResult: 'コンクリ: 850㎥、鉄筋: 120t、型枠: 3,200㎡' },
    { type: 'tool_call', delay: 1200, toolName: 'site_fetch_unit_prices', toolResult: '2026年4月 東京都単価を適用' },
    { type: 'tool_call', delay: 1500, toolName: 'doc_generate_estimate', toolResult: '見積書を生成しました' },
    {
      type: 'assistant',
      delay: 800,
      content: '見積書が完成しました。',
      artifact: {
        title: '概算見積書',
        type: 'estimate',
        content: estimateHtml,
      },
    },
  ],
};

export default scenario;
