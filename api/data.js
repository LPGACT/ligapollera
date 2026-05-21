export default async function handler(req, res) {
  const SHEET_ID = '1wKq_ZD1WQllmrfQh63GX-T1w2BwOgXzO_mJGaBLZdwU';
  const GID      = '1690366586';

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google Sheets respondió con HTTP ${response.status}`);

    const text = await response.text();
    const m    = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/);
    if (!m) throw new Error('Formato de respuesta inesperado');

    const data = JSON.parse(m[1]);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
