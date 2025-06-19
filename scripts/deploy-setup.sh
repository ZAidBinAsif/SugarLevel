#!/bin/bash

echo "🚀 Setting up GlucoTracker for deployment..."

# Create necessary files for deployment
echo "📝 Creating deployment configuration..."

# Ensure all required files exist
touch .gitignore
touch .env.example
touch README.md

# Add to .gitignore
cat > .gitignore << EOL
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOL

echo "✅ Deployment setup complete!"
echo ""
echo "🌐 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push code to your GitHub repo"
echo "2. Connect repo to Vercel"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy!"
