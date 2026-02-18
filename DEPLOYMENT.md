# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
```bash
cp .env.example .env.local
# Fill in all required values
```

### 2. Build Test
```bash
npm run build
npm start
```

### 3. Security Audit
```bash
npm audit
npm audit fix
```

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option 2: Docker
```bash
docker build -t postcraft .
docker run -p 3000:3000 postcraft
```

### Option 3: Traditional Hosting
```bash
npm run build
# Upload .next, public, package.json, next.config.js
# Run: npm install --production && npm start
```

## Post-Deployment

### 1. Set up monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Uptime monitoring

### 2. Performance
- [ ] Enable CDN
- [ ] Configure caching
- [ ] Set up database indexes

### 3. Security
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up rate limiting
- [ ] Enable DDoS protection

### 4. Backups
- [ ] Database backups
- [ ] User data backups
- [ ] Configuration backups

## Environment Variables Required

```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
GEMINI_API_KEY=xxx
STRIPE_SECRET_KEY=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
```

## Performance Targets

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Monitoring URLs

- Production: https://your-domain.com
- Status Page: https://status.your-domain.com
- Analytics: https://analytics.your-domain.com
