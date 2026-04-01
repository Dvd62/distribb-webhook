/**
 * Distribb Integration - Express Server Example
 * 
 * Quick start server to receive Distribb webhooks.
 */

require('dotenv').config();
const express = require('express');
const { handleDistribbWebhook } = require('./webhook-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'distribb-integration' });
});

// Distribb webhook endpoint
app.post('/webhooks/distribb', handleDistribbWebhook);

// Also support root path for Railway
app.post('/', handleDistribbWebhook);

// Debug: log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// List received articles (for testing)
app.get('/articles', async (req, res) => {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const storageDir = path.join(__dirname, 'received-articles');
    const files = await fs.readdir(storageDir);
    
    const articles = [];
    for (const file of files.slice(-20)) { // Last 20 articles
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(storageDir, file), 'utf8');
        articles.push(JSON.parse(content));
      }
    }
    
    res.json({ articles });
  } catch (error) {
    res.json({ articles: [], error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found', 
    path: req.path,
    method: req.method,
    available: ['/health', '/webhooks/distribb', '/articles', '/']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Distribb integration server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhooks/distribb`);
});
