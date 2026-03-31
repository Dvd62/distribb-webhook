/**
 * Test script for Distribb webhook
 * 
 * Simulates a webhook payload from Distribb for testing.
 */

const http = require('http');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhooks/distribb';
const WEBHOOK_SECRET = process.env.DISTRIBB_WEBHOOK_SECRET || 'test-secret';

// Sample article payload (matches Distribb format)
const samplePayload = {
  data: {
    articles: [
      {
        title: "10 AI Tools That Will 10x Your Productivity in 2025",
        slug: "10-ai-tools-productivity-2025",
        content_html: "<h2>The AI Revolution is Here</h2><p>Artificial intelligence isn't coming—it's already here...</p>",
        content_markdown: "## The AI Revolution is Here\n\nArtificial intelligence isn't coming—it's already here...",
        meta_description: "Discover the top 10 AI tools that can 10x your productivity and streamline your workflow in 2025.",
        image_url: "https://example.com/images/ai-productivity.jpg",
        alt_text: "Person using AI tools on laptop",
        tags: ["AI", "Productivity", "Technology", "Automation"],
        author: "David Collier",
        status: "Published"
      }
    ]
  }
};

async function testWebhook() {
  console.log('Testing Distribb webhook...');
  console.log(`URL: ${WEBHOOK_URL}`);
  
  const url = new URL(WEBHOOK_URL);
  const postData = JSON.stringify(samplePayload);
  
  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${WEBHOOK_SECRET}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run test
testWebhook()
  .then(() => console.log('\nTest complete!'))
  .catch(err => console.error('\nTest failed:', err.message));
