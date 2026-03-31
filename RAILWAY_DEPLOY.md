# Deploy to Railway

## Prerequisites

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

## Deploy Steps

1. **Initialize project:**
   ```bash
   cd /root/.openclaw/workspace/integrations/distribb
   railway init
   ```

2. **Set environment variables:**
   ```bash
   railway variables set DISTRIBB_WEBHOOK_SECRET=distribb-webhook-secret-2025
   railway variables set DISTRIBB_API_KEY=7teat3ZC4Ib6afy8eFhbmzfPpRZGdXn7
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

4. **Get your public URL:**
   ```bash
   railway domain
   ```

## Alternative: Railway Dashboard

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repo
4. Add environment variables in the Variables tab
5. Deploy!

## Webhook URL

Once deployed, your webhook endpoint will be:
```
https://your-app-name.up.railway.app/webhooks/distribb
```

Use this in Distribb → Integrations → API Webhook
