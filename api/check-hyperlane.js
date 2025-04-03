// api/check-hyperlane.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { addresses } = req.query;
  if (!addresses) return res.status(400).json({ error: 'Missing addresses' });

  const list = addresses.split(',').map(a => a.trim()).filter(Boolean);
  const results = {};

  for (const addr of list) {
    try {
      const url = `https://claim.hyperlane.foundation/api/check-eligibility?address=${addr}`;
      const response = await fetch(url);
      const data = await response.json();
      results[addr] = data;
    } catch (e) {
      results[addr] = { error: true, message: e.message };
    }
  }

  res.status(200).json({ results });
}
