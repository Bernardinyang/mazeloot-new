# Quick Icon Setup for PWA Install Button

## The Problem
The install button won't show if PNG icons are missing. The browser needs valid icons to trigger the install prompt.

## Quick Fix (2 minutes)

### Option 1: Use the Icon Generator
1. Open `public/create-icons-simple.html` in your browser
2. Click "Generate Icons" 
3. Click "Download Both Icons"
4. Move the downloaded files to `mazeloot-frontend/public/`:
   - `icon-192.png` → `public/icon-192.png`
   - `icon-512.png` → `public/icon-512.png`

### Option 2: Create Icons Manually
Create two PNG files:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

You can use any image editor or online tool.

### Option 3: Use Online Tool
1. Go to https://realfavicongenerator.net/ or similar
2. Upload your logo
3. Download the 192x192 and 512x512 PNG icons
4. Save to `public/` folder

## After Adding Icons

1. **Restart dev server**: Stop and restart `npm run dev`
2. **Hard refresh**: Clear cache (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check console**: Open DevTools → Console, look for `[PWA Debug]` messages
4. **Check manifest**: DevTools → Application → Manifest (should show icons)

## Verify It Works

After adding icons, you should see:
- Install button in address bar (Chrome/Edge)
- Install prompt banner in the app (bottom right)
- "Install Mazeloot" in browser menu

## Debug

If still not working, check:
- DevTools → Application → Manifest (icons should be listed)
- DevTools → Console (look for PWA debug messages)
- DevTools → Application → Service Workers (should be active)
- Network tab: Check if `/icon-192.png` and `/icon-512.png` load (200 status)

