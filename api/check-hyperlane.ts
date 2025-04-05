export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const addresses = searchParams.get('addresses');

  if (!addresses) {
    return new Response(JSON.stringify({ error: 'Missing addresses' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const list = addresses.split(',').map(a => a.trim()).filter(Boolean);
  const results: Record<string, any> = {};

  for (const addr of list) {
    try {
      const apiUrl = `https://claim.hyperlane.foundation/api/check-eligibility?address=${addr}`;
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      results[addr] = data;
    } catch (e: any) {
      results[addr] = { error: true, message: e.message };
    }
  }

  return new Response(JSON.stringify({ results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
