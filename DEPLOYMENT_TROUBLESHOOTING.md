# Deployment Troubleshooting Guide

## Manual Deployment Steps

### Option 1: Deploy via GitHub
1. Push your code to GitHub
2. Connect GitHub repo to Vercel
3. Deploy from Vercel dashboard

### Option 2: Deploy via Vercel CLI
\`\`\`bash
npm i -g vercel
vercel login
vercel --prod
\`\`\`

### Option 3: Deploy via v0
1. Click "Deploy" button in v0
2. Wait for deployment to complete
3. Check Vercel dashboard

## Environment Variables Required
- NEXT_PUBLIC_SUPABASE_URL: https://ahepczmzrmklfhjcrtih.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Common Issues
1. **Stuck on "Deploying"**: Check build logs for errors
2. **Not showing in Vercel**: Environment variables missing
3. **Build fails**: Check package.json dependencies
4. **Runtime errors**: Check Supabase connection

## Debug Commands
\`\`\`bash
# Check build locally
npm run build

# Check for errors
npm run lint

# Test production build
npm run start
