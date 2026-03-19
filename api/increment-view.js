let viewCount = 3242;

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  viewCount += 1;
  res.status(200).json({ viewCount });
}
