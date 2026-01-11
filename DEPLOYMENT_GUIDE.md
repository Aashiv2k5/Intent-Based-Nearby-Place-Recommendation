# Foursquare Intent Finder - Vercel Deployment Guide

## 📁 Project Structure

Create a folder with these files:

```
foursquare-app/
├── api/
│   └── places.js          (Serverless function)
├── index.html             (Frontend)
├── package.json
├── vercel.json
└── README.md
```

## 🚀 Quick Deploy Steps

### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Create Your Project Folder

```bash
mkdir foursquare-app
cd foursquare-app
```

### 3. Create the Files

Copy the contents from the artifacts:
- `api/places.js` - The serverless backend function
- `index.html` - The frontend HTML
- `package.json` - Package configuration
- `vercel.json` - Vercel configuration

### 4. Deploy to Vercel

```bash
# Login to Vercel (first time only)
vercel login

# Deploy
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → foursquare-app (or your choice)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

### 5. Deploy to Production

```bash
vercel --prod
```

## 🔐 Environment Variables (Recommended)

For better security, set your API key as an environment variable:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key**: `FOURSQUARE_API_KEY`
   - **Value**: `fsq30H+ggHTSshQ6/mgAo3WPyp1AN2bQlb9Cl7V2nL20mtk=`
   - **Environment**: All (Production, Preview, Development)

4. Remove the hardcoded key from `api/places.js` line 27 and use only:
   ```javascript
   const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
   ```

## ✅ Testing Your Deployment

After deployment, Vercel will give you a URL like: `https://foursquare-app-xyz.vercel.app`

Visit it and:
1. Allow location access when prompted
2. Click on any intent button (Work, Date, Quick Bite, Budget)
3. You should see real places from Foursquare!

## 🐛 Troubleshooting

### "No places found"
- Check browser console for errors
- Verify your Foursquare API key is valid
- Make sure location permissions are enabled

### "Failed to fetch"
- Check that the serverless function deployed correctly
- Visit `https://your-url.vercel.app/api/places?ll=10.87,77.02&query=coffee` directly to test

### Deployment Issues
- Make sure all files are in the correct directories
- Verify `vercel.json` is in the root folder
- Check Vercel deployment logs for errors

## 📝 Local Development

To test locally before deploying:

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev
```

Then open `http://localhost:3000` in your browser.

## 🔄 Updating Your Deployment

After making changes:

```bash
# Deploy again
vercel --prod
```

Vercel will automatically update your live site!

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Foursquare Places API Docs](https://docs.foursquare.com/fsq-developers-places/reference)
- [Serverless Functions Guide](https://vercel.com/docs/functions/serverless-functions)

## 🎉 You're Done!

Your app should now be live and working with real Foursquare data!