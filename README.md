# Distribb Integration

Full integration with Distribb.io for content publishing automation.

## Overview

This integration handles:
1. **Receive** — Webhook endpoint to receive published articles from Distribb
2. **Send** — Push content to Distribb for publishing
3. **Automate** — Workflow triggers and actions

## Setup

### 1. Environment Variables

Add to your `.env` or environment:

```bash
# For receiving from Distribb
DISTRIBB_WEBHOOK_SECRET=your-webhook-secret-here

# For sending to Distribb (if they provide API keys)
DISTRIBB_API_KEY=your-api-key
DISTRIBB_API_URL=https://api.distribb.io/v1
```

### 2. Webhook Endpoint

The integration exposes a webhook endpoint at:
```
POST /webhooks/distribb
```

Configure this in Distribb → Integrations → API Webhook.

### 3. Distribb Configuration

In your Distribb dashboard:
- Go to **Integrations → API Webhook**
- Set **Webhook Endpoint**: `https://your-domain.com/webhooks/distribb`
- Set **Access Token**: Same as `DISTRIBB_WEBHOOK_SECRET`
- Click **Test Your Webhook** to verify

## Received Article Format

```json
{
  "data": {
    "articles": [
      {
        "title": "10 Tips for Better SEO in 2025",
        "slug": "10-tips-for-better-seo-2025",
        "content_html": "<h2>Introduction</h2><p>HTML content...</p>",
        "content_markdown": "## Introduction\n\nMarkdown content...",
        "meta_description": "Improve your rankings with these 10 proven SEO tips.",
        "image_url": "https://example.com/images/featured.jpg",
        "alt_text": "A laptop with SEO charts on screen",
        "tags": ["SEO", "Content Marketing", "Digital Marketing"],
        "author": "Jane Smith",
        "status": "Published"
      }
    ]
  }
}
```

## Actions

### On Article Received

When an article is received from Distribb, the integration can:

1. **Store in Database** — Save to your CMS/content database
2. **Send Notification** — Alert team via Slack/Discord/Email
3. **Trigger Workflow** — Start automated processing (AI enhancement, translation, etc.)
4. **Cross-post** — Publish to other platforms (social media, newsletter)
5. **Archive** — Save to long-term storage

### Send to Distribb

To push content to Distribb for publishing:

```javascript
// Example: Create article in Distribb
await distribb.createArticle({
  title: "My Article Title",
  content: "Article body...",
  status: "draft", // or "published"
  tags: ["AI", "Marketing"],
  projectId: "your-project-id"
});
```

## Workflows

### Workflow 1: Auto-Enhance Received Articles

```
Distribb publishes article
    ↓
Receive webhook
    ↓
AI enhancement (improve SEO, add internal links)
    ↓
Update article
    ↓
Notify team
```

### Workflow 2: Content Distribution Pipeline

```
Create content in your system
    ↓
Send to Distribb
    ↓
Distribb publishes to WordPress
    ↓
Webhook confirms publication
    ↓
Auto-share to social media
    ↓
Send newsletter notification
```

### Workflow 3: Multi-Platform Publishing

```
Distribb publishes article
    ↓
Webhook received
    ↓
Simultaneously:
    ├── Post to LinkedIn
    ├── Post to Twitter/X
    ├── Add to email queue
    └── Update content calendar
```

## Implementation Files

- `webhook-handler.js` — Express/Fastify handler for incoming webhooks
- `distribb-client.js` — API client for sending to Distribb
- `workflows/` — Workflow automation scripts

## Testing

Use the "Test Your Webhook" button in Distribb to send sample payloads.

## Security

- Webhook requests are authenticated via Bearer token
- Token is compared against `DISTRIBB_WEBHOOK_SECRET`
- Reject requests with invalid/missing tokens (401 Unauthorized)
- Use HTTPS only for webhook endpoints

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check webhook secret matches |
| 404 Not Found | Verify endpoint URL is correct |
| Articles not processing | Check server logs for payload parsing errors |
| Test webhook fails | Ensure endpoint is publicly accessible |
