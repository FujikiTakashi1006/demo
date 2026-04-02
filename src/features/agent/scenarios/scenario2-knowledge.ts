import type { ScenarioDefinition } from './types';

const knowledgeHtml = `
<style>
  .k {
    font-family: 'Noto Sans JP', -apple-system, sans-serif;
    max-width: 560px;
    margin: 0 auto;
    color: #18181b;
    box-sizing: border-box;
  }
  .k *, .k *::before, .k *::after { box-sizing: border-box; }

  /* Header */
  .k-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .k-head h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .k-head .k-sub { font-size: 11px; color: #a1a1aa; margin-top: 2px; }
  .k-head .k-date { text-align: right; }
  .k-head .k-date p { margin: 0; font-size: 12px; }
  .k-head .k-date .day { font-weight: 700; font-size: 13px; }

  /* Stats row */
  .k-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 22px;
  }
  .k-stat {
    background: #fafafa;
    border-radius: 12px;
    padding: 14px 10px;
    text-align: center;
  }
  .k-stat .val {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
  }
  .k-stat .val .unit { font-size: 11px; font-weight: 600; color: #71717a; }
  .k-stat .lbl { font-size: 10px; color: #a1a1aa; margin-top: 5px; }
  .k-stat-accent .val { color: #7c3aed; }

  /* Section label */
  .k-section-label {
    font-size: 10px;
    font-weight: 700;
    color: #a1a1aa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 10px;
  }

  /* Card */
  .k-card {
    border-radius: 14px;
    background: #fff;
    margin-bottom: 14px;
    border: 1px solid #d4d4d8;
    overflow: hidden;
  }

  /* Image with overlay */
  .k-card-hero {
    position: relative;
    height: 120px;
    overflow: hidden;
  }
  @media (min-width: 400px) {
    .k-card-hero { height: 150px; }
  }
  .k-card-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .k-card-hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px 16px 12px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .k-card-hero-overlay h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .k-card-hero-overlay .k-rank {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .k-score-ring {
    position: relative;
    width: 48px;
    height: 48px;
  }
  .k-score-ring svg { display: block; }
  .k-score-val {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }
  .k-score-val span { font-size: 9px; }

  /* Card body */
  .k-card-body {
    padding: 14px 16px 16px;
  }
  .k-cond {
    font-size: 12px;
    color: #71717a;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .k-cond-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ea580c;
    flex-shrink: 0;
  }

  /* Info grid */
  .k-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 12px;
  }
  @media (min-width: 400px) {
    .k-grid { grid-template-columns: 1fr 1fr; }
  }
  .k-item {
    background: #fafafa;
    border-radius: 10px;
    padding: 10px 12px;
  }
  .k-item .k-label {
    font-size: 10px;
    font-weight: 700;
    color: #a1a1aa;
    letter-spacing: 0.05em;
    margin-bottom: 3px;
  }
  .k-item .k-val {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
  }
  .k-item-ok .k-val { color: #16a34a; }

  /* Note */
  .k-note {
    font-size: 12px;
    color: #71717a;
    line-height: 1.5;
    padding: 10px 12px;
    background: #fafafa;
    border-radius: 10px;
  }
  .k-note strong { color: #18181b; }

  /* Footer */
  .k-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #a1a1aa;
    padding-top: 12px;
    border-top: 1px solid #f4f4f5;
    margin-top: 8px;
  }
</style>

<div class="k">
  <!-- Header -->
  <div class="k-head">
    <div>
      <h2>軟弱地盤 × 杭打ち</h2>
      <div class="k-sub">ナレッジDBより類似事例を抽出</div>
    </div>
    <div class="k-date">
      <p class="day">2026.04.01</p>
      <p class="k-sub">検索ID: KN-20260401</p>
    </div>
  </div>

  <!-- Stats -->
  <div class="k-stats">
    <div class="k-stat">
      <div class="val">87<span class="unit">件</span></div>
      <div class="lbl">ヒット数</div>
    </div>
    <div class="k-stat k-stat-accent">
      <div class="val">94<span class="unit">%</span></div>
      <div class="lbl">最高類似度</div>
    </div>
    <div class="k-stat">
      <div class="val">3<span class="unit">件</span></div>
      <div class="lbl">抽出事例</div>
    </div>
  </div>

  <!-- Card 1 -->
  <div class="k-section-label">類似度上位3件</div>

  <div class="k-card">
    <div class="k-card-hero">
      <img src="/souko.png" alt="千葉臨海地区 物流倉庫">
      <div class="k-card-hero-overlay">
        <h3>千葉臨海地区<br>物流倉庫</h3>
        <div class="k-rank">
          <div class="k-score-ring">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="#a78bfa" stroke-width="4"
                stroke-dasharray="${0.94 * 2 * Math.PI * 20} ${2 * Math.PI * 20}"
                stroke-linecap="round" transform="rotate(-90 24 24)" />
            </svg>
            <div class="k-score-val">94<span>%</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="k-card-body">
      <div class="k-cond"><span class="k-cond-dot"></span>N値3以下の軟弱粘土層（GL-15m）</div>

      <div class="k-grid">
        <div class="k-item">
          <div class="k-label">採用工法</div>
          <div class="k-val">プレボーリング拡大根固め工法</div>
        </div>
        <div class="k-item k-item-ok">
          <div class="k-label">結果</div>
          <div class="k-val">支持力OK / 沈下2mm以内</div>
        </div>
      </div>
      <div class="k-note"><strong>山田主任</strong> — セメントミルク注入量の管理が重要</div>
    </div>
  </div>

  <!-- Card 2 -->
  <div class="k-card">
    <div class="k-card-hero">
      <img src="/minato.png" alt="横浜港湾 商業施設">
      <div class="k-card-hero-overlay">
        <h3>横浜港湾<br>商業施設</h3>
        <div class="k-rank">
          <div class="k-score-ring">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="#a78bfa" stroke-width="4"
                stroke-dasharray="${0.87 * 2 * Math.PI * 20} ${2 * Math.PI * 20}"
                stroke-linecap="round" transform="rotate(-90 24 24)" />
            </svg>
            <div class="k-score-val">87<span>%</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="k-card-body">
      <div class="k-cond"><span class="k-cond-dot"></span>埋立地・液状化リスクあり（GL-20m）</div>

      <div class="k-grid">
        <div class="k-item">
          <div class="k-label">採用工法</div>
          <div class="k-val">鋼管杭 + 深層混合処理</div>
        </div>
        <div class="k-item">
          <div class="k-label">結果</div>
          <div class="k-val">液状化対策有効 / 工期+2週</div>
        </div>
      </div>
      <div class="k-note"><strong>佐藤課長</strong> — 周辺建物への影響監視を並行実施</div>
    </div>
  </div>

  <!-- Card 3 -->
  <div class="k-card">
    <div class="k-card-hero">
      <img src="/manshon.png" alt="埼玉 マンション新築">
      <div class="k-card-hero-overlay">
        <h3>埼玉<br>マンション新築</h3>
        <div class="k-rank">
          <div class="k-score-ring">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="#a78bfa" stroke-width="4"
                stroke-dasharray="${0.82 * 2 * Math.PI * 20} ${2 * Math.PI * 20}"
                stroke-linecap="round" transform="rotate(-90 24 24)" />
            </svg>
            <div class="k-score-val">82<span>%</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="k-card-body">
      <div class="k-cond"><span class="k-cond-dot"></span>腐植土層あり（GL-8m）</div>

      <div class="k-grid">
        <div class="k-item">
          <div class="k-label">採用工法</div>
          <div class="k-val">場所打ちコンクリート杭（アースドリル）</div>
        </div>
        <div class="k-item k-item-ok">
          <div class="k-label">結果</div>
          <div class="k-val">品質安定 / コスト-10%</div>
        </div>
      </div>
      <div class="k-note"><strong>木村所長</strong> — スライム処理を入念に行うこと</div>
    </div>
  </div>

  <div class="k-footer">
    <span>AIエージェント自動生成</span>
    <span>2026/04/01 14:20</span>
  </div>
</div>
`;

const scenario: ScenarioDefinition = {
  id: 'knowledge',
  label: '過去の知見を検索',
  iconId: 'psychology',
  trigger: '軟弱地盤での杭打ち、過去にどうやった？',
  keywords: ['過去', '知見', '事例', 'どうやった', 'ナレッジ'],
  steps: [
    { type: 'assistant', delay: 800, content: 'ナレッジDBを検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'knowledge_search', toolResult: '「軟弱地盤」「杭打ち」で87件ヒット' },
    { type: 'tool_call', delay: 1200, toolName: 'knowledge_rank_similar', toolResult: '類似度上位3件を抽出' },
    { type: 'tool_call', delay: 1200, toolName: 'site_fetch_records', toolResult: '各案件の施工記録を取得' },
    {
      type: 'assistant',
      delay: 800,
      content: '類似事例3件が見つかりました。',
      artifact: {
        title: '過去事例サマリー',
        type: 'knowledge',
        content: knowledgeHtml,
      },
    },
  ],
};

export default scenario;
