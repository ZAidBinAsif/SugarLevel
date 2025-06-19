# 🩸 GlucoTracker - Blood Sugar Management App

A modern, secure blood sugar tracking application built with Next.js and Supabase.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   Create `.env.local` file:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser:**
   \`\`\`
   http://localhost:3000
   \`\`\`

### 🌐 Deploy to Production

#### Option 1: Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

#### Option 2: Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔧 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 📊 Features

- ✅ Secure user authentication
- ✅ Blood sugar reading tracking
- ✅ Interactive charts and graphs
- ✅ Data export (CSV)
- ✅ Emergency alerts
- ✅ Mobile responsive
- ✅ Real-time data sync
- ✅ Date-based filtering

## 🛡️ Security

- Row Level Security (RLS) enabled
- User data isolation
- Secure authentication with Supabase
- HTTPS encryption

## 📱 Usage

1. **Sign up** for a new account
2. **Log readings** with the "Log Reading" button
3. **View trends** in the interactive charts
4. **Export data** for sharing with healthcare providers
5. **Set up alerts** for emergency situations

## 🆘 Troubleshooting

### Graphs not showing?
- Make sure you have logged some blood sugar readings
- Check browser console for errors
- Verify Supabase connection

### Can't log in?
- Check your Supabase configuration
- Verify environment variables are set
- Check network connection

### Local development issues?
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

## 📞 Support

For issues or questions, please check:
1. This README file
2. Browser developer console
3. Supabase dashboard logs
