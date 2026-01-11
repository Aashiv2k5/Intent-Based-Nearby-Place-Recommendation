// api/places.js
// Vercel serverless function for Foursquare API v2

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ll, query, limit = '10' } = req.query;

    // Validate required parameters
    if (!ll || !query) {
      return res.status(400).json({
        error: 'Missing required parameters: ll and query'
      });
    }

    // Foursquare API v2 credentials (use environment variables in production!)
    const CLIENT_ID = process.env.FOURSQUARE_CLIENT_ID || 'CQIJXNGD1SMG413ST21E4BSGDYQFZ4OQNKQLQNES01SACMHF';
    const CLIENT_SECRET = process.env.FOURSQUARE_CLIENT_SECRET || 'R1U0Z5UBW4GFNZ0X5Q4HLXEAQO1EYEXWZHDUNVJAXE1HEBPS';

    // Version in YYYYMMDD format (today's date)
    const today = new Date();
    const version = today.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD

    // Build Foursquare API v2 URL with query parameters
    const foursquareUrl = new URL('https://api.foursquare.com/v2/venues/search');
    foursquareUrl.searchParams.append('client_id', CLIENT_ID);
    foursquareUrl.searchParams.append('client_secret', CLIENT_SECRET);
    foursquareUrl.searchParams.append('ll', ll);
    foursquareUrl.searchParams.append('query', query);
    foursquareUrl.searchParams.append('limit', limit);
    foursquareUrl.searchParams.append('v', version);

    // Call Foursquare API v2
    const response = await fetch(foursquareUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Foursquare API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Foursquare API error',
        details: errorText
      });
    }

    // Parse and return the data
    const data = await response.json();

    // v2 API returns data in response.venues, transform to match our expected format
    const transformedData = {
      results: data.response?.venues || []
    };

    return res.status(200).json(transformedData);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
