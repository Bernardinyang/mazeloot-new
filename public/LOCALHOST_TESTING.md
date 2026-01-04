# Testing PWA on Localhost

## ✅ Yes, PWAs work on localhost!

PWAs can be installed and work perfectly on:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- Any localhost port

**No HTTPS required for localhost!** This is a special exception for development.

## How to Test Installation

### 1. Start the dev server
```bash
npm run dev
```

### 2. Open in Chrome/Edge
Navigate to `http://localhost:5173`

### 3. Check for install prompt
- Look for the install button in the address bar (desktop)
- Or check the browser menu for "Install Mazeloot"
- The `PWAInstallPrompt` component will also show a banner if installable

### 4. Verify Service Worker
Open DevTools → Application → Service Workers
- You should see the service worker registered
- Status should be "activated and running"

### 5. Verify Manifest
Open DevTools → Application → Manifest
- Check that manifest.json is loaded
- Verify icons are accessible (may show warnings if PNG icons missing)

## Troubleshooting

### Install button not showing?
1. **Check icons**: PNG icons (`icon-192.png`, `icon-512.png`) must exist in `public/`
   - Use `public/convert-icons.html` to generate them
   - Or create your own 192x192 and 512x512 PNG icons

2. **Check manifest**: Open DevTools → Application → Manifest
   - Should show no errors
   - Icons should be listed

3. **Check service worker**: Open DevTools → Application → Service Workers
   - Should be registered and active
   - If not, check console for errors

4. **Clear cache**: Sometimes browser caches prevent installation
   - DevTools → Application → Clear storage → Clear site data

### Service Worker not registering?
- Check browser console for errors
- Ensure `public/sw.js` exists and is accessible at `http://localhost:5173/sw.js`
- Check Network tab to verify the file loads

### Icons not loading?
- SVG icons work but PNG are preferred
- Generate PNG icons using `public/convert-icons.html`
- Place `icon-192.png` and `icon-512.png` in `public/` directory

## Testing After Installation

Once installed:
1. App opens in standalone window (no browser UI)
2. Works offline (cached resources)
3. Appears in OS app launcher
4. Can be uninstalled from OS settings

## Production Notes

For production deployment:
- **HTTPS is required** (except localhost)
- Service worker must be served from root domain
- Icons must be accessible via HTTPS
- Manifest must be served with correct MIME type

