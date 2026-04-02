import type { ScenarioDefinition } from './types';

const scheduleHtml = `
<style>
  .sch {
    font-family: 'Noto Sans JP', -apple-system, sans-serif;
    max-width: 560px;
    margin: 0 auto;
    color: #18181b;
  }

  /* Header */
  .sch-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .sch-head h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .sch-head .sch-sub { font-size: 11px; color: #a1a1aa; margin-top: 2px; }
  .sch-head .sch-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    background: #f0fdf4;
    color: #16a34a;
    white-space: nowrap;
  }

  /* Stats row */
  .sch-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 22px;
  }
  .sch-stat {
    background: #fafafa;
    border-radius: 12px;
    padding: 14px 10px;
    text-align: center;
  }
  .sch-stat .val {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
  }
  .sch-stat .val .unit { font-size: 11px; font-weight: 600; color: #71717a; }
  .sch-stat .lbl { font-size: 10px; color: #a1a1aa; margin-top: 5px; }
  .sch-stat-accent .val { color: #ea580c; }

  /* Section label */
  .sch-label {
    font-size: 10px;
    font-weight: 700;
    color: #a1a1aa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 10px;
  }

  /* Weather strip */
  .sch-weather {
    display: flex;
    gap: 0;
    margin-bottom: 22px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #f4f4f5;
  }
  .sch-weather-day {
    flex: 1;
    text-align: center;
    padding: 10px 4px;
    border-right: 1px solid #f4f4f5;
    font-size: 11px;
  }
  .sch-weather-day:last-child { border-right: none; }
  .sch-weather-day .dow { font-weight: 700; font-size: 12px; margin-bottom: 4px; }
  .sch-weather-day .date { color: #a1a1aa; font-size: 10px; margin-bottom: 6px; }
  .sch-weather-day svg { display: block; margin: 0 auto 4px; }
  .sch-weather-day .prob { font-weight: 700; font-size: 11px; }
  .sch-weather-rain { background: #fef2f2; }
  .sch-weather-rain .prob { color: #dc2626; }
  .sch-weather-sun { background: #fff; }
  .sch-weather-sun .prob { color: #2563eb; }

  /* Timeline gantt */
  .sch-gantt {
    margin-bottom: 22px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .sch-gantt-inner {
    min-width: 420px;
  }
  .sch-gantt-header {
    display: grid;
    grid-template-columns: 100px repeat(5, 1fr);
    gap: 0;
    margin-bottom: 6px;
    padding: 0 0 6px;
    border-bottom: 1px solid #f4f4f5;
  }
  .sch-gantt-header span {
    font-size: 10px;
    font-weight: 700;
    color: #a1a1aa;
    text-align: center;
  }
  .sch-gantt-header span:first-child { text-align: left; }
  .sch-gantt-row {
    display: grid;
    grid-template-columns: 100px repeat(5, 1fr);
    gap: 0;
    align-items: center;
    min-height: 38px;
    margin-bottom: 0;
    padding: 2px 0;
  }
  .sch-gantt-row:nth-child(even) {
    background: #fafafa;
    border-radius: 8px;
  }
  .sch-gantt-task {
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 6px;
  }
  .sch-gantt-bar-cell {
    padding: 3px 2px;
    position: relative;
  }
  .sch-gantt-bar {
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }
  .sch-bar-cancelled {
    background: #dc2626;
    color: #fff;
    text-decoration: line-through;
    opacity: 0.85;
  }
  .sch-bar-replaced {
    background: #16a34a;
    color: #fff;
  }
  .sch-bar-moved {
    background: #2563eb;
    color: #fff;
  }
  .sch-bar-original {
    background: #f4f4f5;
    color: #71717a;
  }

  /* Arrow connector */
  .sch-gantt-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 0;
  }
  .sch-gantt-arrow svg { display: block; }
  .sch-gantt-divider {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
  }
  .sch-gantt-divider::before,
  .sch-gantt-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e4e4e7, transparent);
  }
  .sch-gantt-divider span {
    font-size: 10px;
    font-weight: 700;
    color: #ea580c;
    letter-spacing: 0.06em;
  }

  /* Change detail cards */
  .sch-changes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 22px;
  }
  .sch-change {
    display: flex;
    align-items: stretch;
    gap: 0;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #f4f4f5;
  }
  .sch-change-date {
    width: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 4px;
    font-size: 10px;
    flex-shrink: 0;
  }
  .sch-change-date .dow { font-weight: 800; font-size: 13px; }
  .sch-change-date .dm { color: #a1a1aa; font-size: 10px; margin-top: 1px; }
  .sch-change-date-rain { background: #fef2f2; color: #dc2626; }
  .sch-change-date-sun { background: #eff6ff; color: #2563eb; }
  .sch-change-body {
    flex: 1;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }
  .sch-change-from {
    font-size: 12px;
    color: #a1a1aa;
    text-decoration: line-through;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sch-change-to {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sch-change-to .sch-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .sch-dot-green { background: #16a34a; }
  .sch-dot-blue { background: #2563eb; }

  /* Result card (dark) */
  .sch-result {
    background: #18181b;
    border-radius: 14px;
    padding: 18px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  .sch-result-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(234,88,12,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sch-result-text h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
  }
  .sch-result-text p {
    margin: 3px 0 0;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
  }

  /* Legend */
  .sch-legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .sch-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #71717a;
    font-weight: 500;
  }
  .sch-legend-swatch {
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }

  /* Footer */
  .sch-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #a1a1aa;
    padding-top: 12px;
    border-top: 1px solid #f4f4f5;
  }
</style>

<div class="sch">
  <!-- Header -->
  <div class="sch-head">
    <div>
      <h2>工程調整結果</h2>
      <div class="sch-sub">品川オフィスビル新築工事</div>
    </div>
    <div class="sch-badge">✓ 工期影響なし</div>
  </div>

  <!-- Stats -->
  <div class="sch-stats">
    <div class="sch-stat sch-stat-accent">
      <div class="val">3<span class="unit">日</span></div>
      <div class="lbl">雨天影響日数</div>
    </div>
    <div class="sch-stat">
      <div class="val">3<span class="unit">件</span></div>
      <div class="lbl">振替作業</div>
    </div>
    <div class="sch-stat">
      <div class="val">0<span class="unit">日</span></div>
      <div class="lbl">工期遅延</div>
    </div>
  </div>

  <!-- Weather Strip -->
  <div class="sch-label">週間天気予報</div>
  <div class="sch-weather">
    <div class="sch-weather-day sch-weather-rain">
      <div class="dow">月</div>
      <div class="date">4/7</div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 0 0-5.8 4.5A5 5 0 0 0 7 17h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 12 3Z" fill="#94a3b8"/><circle cx="8" cy="20" r="1" fill="#3b82f6"/><circle cx="12" cy="21" r="1" fill="#3b82f6"/><circle cx="16" cy="20" r="1" fill="#3b82f6"/></svg>
      <div class="prob">80%</div>
    </div>
    <div class="sch-weather-day sch-weather-rain">
      <div class="dow">火</div>
      <div class="date">4/8</div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 0 0-5.8 4.5A5 5 0 0 0 7 17h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 12 3Z" fill="#94a3b8"/><circle cx="8" cy="20" r="1" fill="#3b82f6"/><circle cx="12" cy="21" r="1" fill="#3b82f6"/><circle cx="16" cy="20" r="1" fill="#3b82f6"/></svg>
      <div class="prob">85%</div>
    </div>
    <div class="sch-weather-day sch-weather-rain">
      <div class="dow">水</div>
      <div class="date">4/9</div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 0 0-5.8 4.5A5 5 0 0 0 7 17h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 12 3Z" fill="#94a3b8"/><circle cx="8" cy="20" r="1" fill="#3b82f6"/><circle cx="12" cy="21" r="1" fill="#3b82f6"/><circle cx="16" cy="20" r="1" fill="#3b82f6"/></svg>
      <div class="prob">75%</div>
    </div>
    <div class="sch-weather-day sch-weather-sun">
      <div class="dow">木</div>
      <div class="date">4/10</div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="#fbbf24"/><path d="M12 1v3m0 16v3m11-11h-3M4 12H1m16.7-7.7-2.1 2.1M7.4 16.6l-2.1 2.1m12.4 0-2.1-2.1M7.4 7.4 5.3 5.3" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/></svg>
      <div class="prob">10%</div>
    </div>
    <div class="sch-weather-day sch-weather-sun">
      <div class="dow">金</div>
      <div class="date">4/11</div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="#fbbf24"/><path d="M12 1v3m0 16v3m11-11h-3M4 12H1m16.7-7.7-2.1 2.1M7.4 16.6l-2.1 2.1m12.4 0-2.1-2.1M7.4 7.4 5.3 5.3" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/></svg>
      <div class="prob">5%</div>
    </div>
  </div>

  <!-- Gantt Timeline -->
  <div class="sch-label">工程タイムライン</div>
  <div class="sch-gantt">
    <div class="sch-gantt-inner">
    <div class="sch-gantt-header">
      <span></span>
      <span>4/7 月</span>
      <span>4/8 火</span>
      <span>4/9 水</span>
      <span>4/10 木</span>
      <span>4/11 金</span>
    </div>

    <!-- Before: cancelled tasks -->
    <div class="sch-gantt-row">
      <div class="sch-gantt-task" style="color:#a1a1aa;text-decoration:line-through">外壁塗装 2F</div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-cancelled">中止</div></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-moved">再開→</div></div>
      <div class="sch-gantt-bar-cell"></div>
    </div>
    <div class="sch-gantt-row">
      <div class="sch-gantt-task" style="color:#a1a1aa;text-decoration:line-through">屋上防水</div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-cancelled">中止</div></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-moved">再開→</div></div>
    </div>
    <div class="sch-gantt-row">
      <div class="sch-gantt-task" style="color:#a1a1aa;text-decoration:line-through">外壁塗装 3F</div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-cancelled">中止</div></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-moved">再開→</div></div>
    </div>

    <!-- Divider -->
    <div class="sch-gantt-divider"><span>振替作業</span></div>

    <!-- After: replacement tasks -->
    <div class="sch-gantt-row">
      <div class="sch-gantt-task" style="color:#15803d">内装下地 5F</div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-replaced">振替</div></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
    </div>
    <div class="sch-gantt-row">
      <div class="sch-gantt-task" style="color:#15803d">電気配線 3F</div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-replaced">振替</div></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
    </div>
    <div class="sch-gantt-row">
      <div class="sch-gantt-task" style="color:#15803d">設備配管 4F</div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"><div class="sch-gantt-bar sch-bar-replaced">振替</div></div>
      <div class="sch-gantt-bar-cell"></div>
      <div class="sch-gantt-bar-cell"></div>
    </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="sch-legend">
    <div class="sch-legend-item">
      <div class="sch-legend-swatch" style="background:#dc2626"></div>
      雨天中止
    </div>
    <div class="sch-legend-item">
      <div class="sch-legend-swatch" style="background:#16a34a"></div>
      内作業に振替
    </div>
    <div class="sch-legend-item">
      <div class="sch-legend-swatch" style="background:#2563eb"></div>
      晴天日に移動
    </div>
  </div>

  <!-- Change Detail Cards -->
  <div class="sch-label">変更詳細</div>
  <div class="sch-changes">
    <div class="sch-change">
      <div class="sch-change-date sch-change-date-rain">
        <div class="dow">月</div>
        <div class="dm">4/7</div>
      </div>
      <div class="sch-change-body">
        <div class="sch-change-from">外壁塗装 2F（品川）</div>
        <div class="sch-change-to"><span class="sch-dot sch-dot-green"></span>内装下地処理 5F（品川）</div>
      </div>
    </div>
    <div class="sch-change">
      <div class="sch-change-date sch-change-date-rain">
        <div class="dow">火</div>
        <div class="dm">4/8</div>
      </div>
      <div class="sch-change-body">
        <div class="sch-change-from">屋上防水（品川）</div>
        <div class="sch-change-to"><span class="sch-dot sch-dot-green"></span>電気配線 3F（品川）</div>
      </div>
    </div>
    <div class="sch-change">
      <div class="sch-change-date sch-change-date-rain">
        <div class="dow">水</div>
        <div class="dm">4/9</div>
      </div>
      <div class="sch-change-body">
        <div class="sch-change-from">外壁塗装 3F（品川）</div>
        <div class="sch-change-to"><span class="sch-dot sch-dot-green"></span>設備配管 4F（品川）</div>
      </div>
    </div>
    <div class="sch-change">
      <div class="sch-change-date sch-change-date-sun">
        <div class="dow">木</div>
        <div class="dm">4/10</div>
      </div>
      <div class="sch-change-body">
        <div class="sch-change-to"><span class="sch-dot sch-dot-blue"></span>外壁塗装 2F（品川）← 4/7より移動</div>
      </div>
    </div>
    <div class="sch-change">
      <div class="sch-change-date sch-change-date-sun">
        <div class="dow">金</div>
        <div class="dm">4/11</div>
      </div>
      <div class="sch-change-body">
        <div class="sch-change-to"><span class="sch-dot sch-dot-blue"></span>屋上防水 + 外壁塗装 3F ← 4/8-9より移動</div>
      </div>
    </div>
  </div>

  <!-- Result card -->
  <div class="sch-result">
    <div class="sch-result-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#ea580c" stroke-width="2"/></svg>
    </div>
    <div class="sch-result-text">
      <h3>全体工期への影響なし</h3>
      <p>内装作業を前倒しで消化 / 外作業は晴天日に集約</p>
    </div>
  </div>

  <div class="sch-footer">
    <span>AIエージェント自動生成</span>
    <span>2026/04/07 09:15</span>
  </div>
</div>
`;

const scenario: ScenarioDefinition = {
  id: 'schedule',
  label: '工程を再調整',
  iconId: 'calendar_month',
  trigger: '来週雨予報だけど工程大丈夫？',
  keywords: ['工程', '雨', 'スケジュール', '天気', '調整'],
  steps: [
    { type: 'assistant', delay: 800, content: '来週の天気予報と工程への影響を確認します。' },
    { type: 'tool_call', delay: 1200, toolName: 'weather_get_forecast', toolResult: '4/7(月)〜4/9(水) 降水確率80%、4/10(木)以降 晴れ' },
    { type: 'tool_call', delay: 1200, toolName: 'site_fetch_schedule', toolResult: '該当期間: 外壁塗装・屋上防水（雨天作業不可）' },
    { type: 'tool_call', delay: 1200, toolName: 'site_fetch_workers', toolResult: '振替可能な内装作業の職人3名を確認' },
    { type: 'tool_call', delay: 1500, toolName: 'doc_recalculate_schedule', toolResult: '工程を再計算しました' },
    {
      type: 'assistant',
      delay: 800,
      content: '工程を再調整しました。全体工期への影響はありません。',
      artifact: {
        title: '工程調整結果',
        type: 'chart',
        content: scheduleHtml,
      },
    },
  ],
};

export default scenario;
