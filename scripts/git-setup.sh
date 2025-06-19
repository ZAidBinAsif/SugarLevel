#!/bin/bash

echo "📦 Setting up Git repository for deployment..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
git add .

# Create initial commit
git commit -m "🚀 Initial GlucoTracker deployment

Features:
- ✅ Secure user authentication with Supabase
- ✅ Blood sugar reading tracking
- ✅ Interactive charts and analytics
- ✅ Data export functionality
- ✅ Emergency alerts
- ✅ Mobile responsive design
- ✅ Real-time data synchronization
- ✅ Row-level security for data protection

Ready for production deployment!"

echo "✅ Initial commit created"
echo ""
echo "🌐 Next steps:"
echo "1. Push to your GitHub repository:"
echo "   git remote add origin https://github.com/yourusername/your-repo.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables"
echo "   - Deploy!"
