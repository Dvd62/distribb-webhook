# Quick Railway Deploy (No CLI needed)

## Option 1: Railway Dashboard (Easiest)

1. **Push to GitHub:**
   ```bash
   cd /root/.openclaw/workspace/integrations/distribb
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create distribb-webhook --public --source=. --push
   ```

2. **Go to Railway:**
   - Visit https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your `distribb-webhook` repo
   - Click "Deploy"

3. **Add Environment Variables:**
   - In Railway dashboard, go to Variables tab
   - Add:
     - `DISTRIBB_WEBHOOK_SECRET` = `distribb-webhook-secret-2025`
     - `DISTRIBB_API_KEY` = `7teat3ZC4Ib6afy8eFhbmzfPpRZGdXn7`

4. **Get your URL:**
   - Railway will give you a URL like `https://distribb-webhook-production.up.railway.app`
   - Your webhook endpoint: `https://distribb-webhook-production.up.railway.app/webhooks/distribb`

## Option 2: Railway Template

Use this one-click deploy button:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/distribb-webhook)

## After Deploy

1. Copy your Railway URL
2. Go to https://distribb.io/integrations
3. Add webhook endpoint: `https://your-railway-url.up.railway.app/webhooks/distribb`
4. Set access token: `distribb-webhook-secret-2025`
5. Click "Test Your Webhook"
