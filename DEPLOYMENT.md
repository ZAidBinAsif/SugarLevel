# 🚀 GlucoTracker Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
\`\`\`bash
git add .
git commit -m "Initial GlucoTracker deployment"
git push origin main
\`\`\`

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### Step 3: Add Environment Variables
In Vercel dashboard, add these environment variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### Step 4: Deploy
Click "Deploy" and wait for build to complete.

Your app will be live at: `https://your-project-name.vercel.app`

## Alternative: Manual Deployment

### Option 1: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
\`\`\`

### Option 2: Netlify
\`\`\`bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the .next folder to Netlify
\`\`\`

## Environment Variables Needed

Get these from your Supabase dashboard (Settings → API):

- `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon/public key

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Can add blood sugar readings
- [ ] Charts display data
- [ ] Data exports work
- [ ] Mobile responsive

## Troubleshooting

### Build Errors
- Check all environment variables are set
- Verify Supabase connection
- Check for TypeScript errors

### Runtime Errors
- Check browser console
- Verify API endpoints
- Check Supabase logs

## Custom Domain (Optional)

1. In Vercel dashboard, go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
