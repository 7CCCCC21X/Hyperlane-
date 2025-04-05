export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { addresses } = req.query;
  if (!addresses) return res.status(400).json({ error: 'Missing addresses' });

  const list = addresses.split(',').map(a => a.trim()).filter(Boolean);
  const results = {};

  for (const addr of list) {
    try {
      const apiUrl = `https://claim.hyperlane.foundation/api/check-eligibility?address=${addr}`;
      const r = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
          'Referer': 'https://claim.hyperlane.foundation/',
          'Origin': 'https://claim.hyperlane.foundation'
        }
      });
      const text = await r.text();

      try {
        const data = JSON.parse(text);
        results[addr] = data;
      } catch (e) {
        results[addr] = { error: true, message: e.message, raw: text };
      }

    } catch (e) {
      results[addr] = { error: true, message: e.message };
    }
  }

  return res.status(200).json({ results });
}
