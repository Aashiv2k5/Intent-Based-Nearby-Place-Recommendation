// Test v2 API with the provided credentials
const CLIENT_ID = 'CQIJXNGD1SMG413ST21E4BSGDYQFZ4OQNKQLQNES01SACMHF';
const CLIENT_SECRET = 'R1U0Z5UBW4GFNZ0X5Q4HLXEAQO1EYEXWZHDUNVJAXE1HEBPS';

async function testV2API() {
    console.log('🧪 Testing Foursquare v2 API\n');

    const latitude = 40.7589;
    const longitude = -73.9851;
    const query = 'coffee';
    const limit = 5;

    // Get today's date in YYYYMMDD format
    const today = new Date();
    const version = today.toISOString().split('T')[0].replace(/-/g, '');

    // Build v2 API URL
    const url = new URL('https://api.foursquare.com/v2/venues/search');
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('client_secret', CLIENT_SECRET);
    url.searchParams.append('ll', `${latitude},${longitude}`);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', limit);
    url.searchParams.append('v', version);

    console.log('📍 Request Details:');
    console.log('   Endpoint: /v2/venues/search');
    console.log('   Location:', `${latitude}, ${longitude}`);
    console.log('   Query:', query);
    console.log('   Version:', version);
    console.log('   Client ID:', CLIENT_ID.substring(0, 20) + '...');
    console.log('\n⏳ Sending request...\n');

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📡 Response Status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('\n❌ Error Response:');
            console.error(errorText);
            return;
        }

        const data = await response.json();
        const venues = data.response?.venues || [];

        console.log('\n✅ SUCCESS! Received', venues.length, 'venues\n');

        if (venues.length > 0) {
            console.log('📋 Results:\n');
            venues.forEach((venue, index) => {
                console.log(`${index + 1}. ${venue.name}`);
                console.log(`   📍 Distance: ${venue.location?.distance}m`);
                console.log(`   📮 Address: ${venue.location?.formattedAddress?.join(', ') || 'N/A'}`);
                console.log(`   🏷️  Category: ${venue.categories?.[0]?.name || 'N/A'}`);
                console.log(`   ⭐ Rating: ${venue.rating || 'N/A'}`);
                console.log('');
            });

            console.log('\n🎉 API is working correctly!');
            console.log('✅ Foursquare v2 API with client credentials');
            console.log('✅ Ready to deploy!\n');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
    }
}

testV2API();
