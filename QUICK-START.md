# Quick Start - Server Deployment

## 🚀 Choose Your Deployment Method

### ☁️ Cloud Platforms (Easiest - Recommended)

#### Option 1: Render.com (Full-Stack) ⭐ **Best for Beginners**
- **One-click deployment** for both frontend and backend
- Built-in PostgreSQL database
- Free tier available
- **Guide**: `RENDER-DEPLOYMENT.md`

```bash
# Just push to GitHub and connect to Render!
```

#### Option 2: Vercel + Railway (Most Scalable)
- **Frontend**: Vercel (Lightning-fast React hosting)
- **Backend**: Railway (Simple Node.js + PostgreSQL)
- **Guide**: `VERCEL-DEPLOYMENT.md`

### 🖥️ Self-Hosted Servers

#### Option 3: Linux Server (Full Control)
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh your-domain.com
```

#### Option 4: Windows Server
```cmd
# Run Windows deployment script
deploy-windows.bat
```

## 📋 What You Need

1. **GitHub Repository** - Your project code
2. **OpenAI API Key** - From https://platform.openai.com/api-keys
3. **Server/Cloud Account** - VPS, AWS, DigitalOcean, etc.
4. **Domain Name** - Optional but recommended

## ⚡ One-Command Deploy (Linux)

```bash
git clone <your-repo-url> spur-chat && cd spur-chat && \
bash deploy.sh your-domain.com
```

## 🔧 Manual Setup

### Backend Setup
```bash
cd backend
npm install --production
cp env.example .env
# Edit .env with your OpenAI API key
npx prisma migrate deploy
npm run build
```

### Frontend Setup  
```bash
cd frontend
npm install
npm run build
```

### Process Management
```bash
npm install -g pm2
pm2 start ../ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Configuration
- Frontend: Serve static files from `frontend/dist`
- Backend: Proxy `/api/*` to `localhost:4000`
- SSL: Use Let's Encrypt for HTTPS

## 🌐 Production URLs

After deployment, your app will be available at:
- `http://your-domain.com` (or your cloud platform URL)
- API endpoints at `http://your-domain.com/api/*`

## 📞 Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.
