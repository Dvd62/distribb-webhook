/**
 * Distribb Webhook Handler
 * 
 * Receives article payloads from Distribb and processes them.
 * 
 * Usage:
 *   app.post('/webhooks/distribb', handleDistribbWebhook);
 */

const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = process.env.DISTRIBB_WEBHOOK_SECRET;

/**
 * Main webhook handler
 */
async function handleDistribbWebhook(req, res) {
  try {
    // 1. Authenticate request
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!WEBHOOK_SECRET || token !== WEBHOOK_SECRET) {
      console.error('[Distribb] Unauthorized webhook attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Parse payload
    const payload = req.body;
    const articles = payload?.data?.articles || [];

    console.log(`[Distribb] Received ${articles.length} article(s)`);

    // 3. Process each article
    const results = [];
    for (const article of articles) {
      const result = await processArticle(article);
      results.push(result);
    }

    // 4. Return success
    res.status(200).json({ 
      success: true, 
      processed: results.length,
      results 
    });

  } catch (error) {
    console.error('[Distribb] Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Process a single article
 */
async function processArticle(article) {
  console.log(`[Distribb] Processing: ${article.title}`);

  // Extract article data
  const {
    title,
    slug,
    content_html,
    content_markdown,
    meta_description,
    image_url,
    alt_text,
    tags,
    author,
    status
  } = article;

  // Build article object
  const articleData = {
    title,
    slug,
    contentHtml: content_html,
    contentMarkdown: content_markdown,
    metaDescription: meta_description,
    imageUrl: image_url,
    altText: alt_text,
    tags: tags || [],
    author,
    status,
    receivedAt: new Date().toISOString(),
    source: 'distribb'
  };

  // Execute workflows
  const workflows = [];

  // Workflow 1: Store in database
  try {
    await storeArticle(articleData);
    workflows.push({ name: 'store', status: 'success' });
  } catch (err) {
    workflows.push({ name: 'store', status: 'error', error: err.message });
  }

  // Workflow 2: Send notification
  try {
    await notifyTeam(articleData);
    workflows.push({ name: 'notify', status: 'success' });
  } catch (err) {
    workflows.push({ name: 'notify', status: 'error', error: err.message });
  }

  // Workflow 3: Cross-post to social (if published)
  if (status === 'Published') {
    try {
      await crossPostToSocial(articleData);
      workflows.push({ name: 'social', status: 'success' });
    } catch (err) {
      workflows.push({ name: 'social', status: 'error', error: err.message });
    }
  }

  // Workflow 4: Add to content calendar
  try {
    await addToContentCalendar(articleData);
    workflows.push({ name: 'calendar', status: 'success' });
  } catch (err) {
    workflows.push({ name: 'calendar', status: 'error', error: err.message });
  }

  return {
    title: article.title,
    status: article.status,
    workflows
  };
}

/**
 * Store article in database
 * (Implement based on your database)
 */
async function storeArticle(article) {
  // TODO: Implement database storage
  // Example: await db.articles.create(article);
  
  console.log(`[Distribb] Storing article: ${article.title}`);
  
  // For now, log to file
  const fs = require('fs').promises;
  const path = require('path');
  
  const storageDir = path.join(__dirname, 'received-articles');
  await fs.mkdir(storageDir, { recursive: true });
  
  const filename = `${article.slug}-${Date.now()}.json`;
  await fs.writeFile(
    path.join(storageDir, filename),
    JSON.stringify(article, null, 2)
  );
  
  return { stored: true, filename };
}

/**
 * Notify team about new article
 */
async function notifyTeam(article) {
  console.log(`[Distribb] Notifying team about: ${article.title}`);
  
  // TODO: Implement notification (Slack, Discord, Email, etc.)
  // Example: await slack.send({ channel: '#content', text: `New article: ${article.title}` });
  
  return { notified: true };
}

/**
 * Cross-post article to social media
 */
async function crossPostToSocial(article) {
  console.log(`[Distribb] Cross-posting to social: ${article.title}`);
  
  // TODO: Implement social posting
  // Example: 
  // await linkedin.post({ title: article.title, link: article.url });
  // await twitter.post({ text: `New article: ${article.title} ${article.url}` });
  
  return { crossPosted: true };
}

/**
 * Add article to content calendar
 */
async function addToContentCalendar(article) {
  console.log(`[Distribb] Adding to content calendar: ${article.title}`);
  
  // TODO: Implement calendar integration
  // Example: await calendar.add({ title: article.title, date: new Date(), type: 'blog-post' });
  
  return { added: true };
}

module.exports = {
  handleDistribbWebhook,
  processArticle
};
