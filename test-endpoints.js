/**
 * Test connection to Distribb services
 * Try different endpoints to find working API
 */

async function testDistribbEndpoints() {
  const API_KEY = '7teat3ZC4Ib6afy8eFhbmzfPpRZGdXn7';
  
  const endpoints = [
    'https://api.distribb.io/v1/projects',
    'https://distribb.io/api/v1/projects',
    'https://app.distribb.io/api/v1/projects',
    'https://api.distribb.io/projects',
  ];
  
  console.log('Testing Distribb API endpoints...\n');
  
  for (const url of endpoints) {
    try {
      console.log(`Trying: ${url}`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      const text = await response.text();
      console.log(`  Status: ${response.status}`);
      console.log(`  Response: ${text.substring(0, 200)}\n`);
      
    } catch (error) {
      console.log(`  Error: ${error.message}\n`);
    }
  }
}

testDistribbEndpoints();
