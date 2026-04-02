// QRスキャン追跡API（確認用）
// Vercel Serverless Function — スキャンログをVercel Logsに出力
export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const data = req.body || {};
  const logEntry = {
    received_at: new Date().toISOString(),
    company_id: data.company || 'unknown',
    user_id: data.user || 'unknown',
    event: data.event || 'unknown',
    device: data.device || 'unknown',
    session_id: data.session_id || '',
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
  };

  // Vercel Logs に出力（vercel logs --follow で確認可能）
  console.log('QR_SCAN:', JSON.stringify(logEntry));

  return res.status(200).json({ ok: true, tracked: logEntry });
}
