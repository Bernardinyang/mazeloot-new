# PWA Setup Instructions

## Icons

The app requires PNG icons for PWA installation. Currently, SVG placeholder icons are provided.

### To create PNG icons:

1. **Option 1: Use an online converter**
   - Upload `icon-192.svg` and `icon-512.svg` to an SVG to PNG converter
   - Export as PNG with exact dimensions (192x192 and 512x512)
   - Save as `icon-192.png` and `icon-512.png` in the `public` directory

2. **Option 2: Use ImageMagick**
   ```bash
   convert icon-192.svg icon-192.png
   convert icon-512.svg icon-512.png
   ```

3. **Option 3: Use design tools**
   - Create branded icons in Figma, Sketch, or Adobe Illustrator
   - Export as PNG with dimensions 192x192 and 512x512
   - Save in the `public` directory

### Icon Requirements:
- **icon-192.png**: 192x192 pixels, PNG format
- **icon-512.png**: 512x512 pixels, PNG format
- Icons should have transparent or solid backgrounds
- Icons should be optimized for web (use tools like TinyPNG)

## Service Worker

The service worker (`sw.js`) is automatically registered on app load. It provides:
- Basic caching for offline functionality
- Faster loading on subsequent visits

## Manifest

The `manifest.json` file defines:
- App name and description
- Theme colors
- Display mode (standalone)
- Icons and shortcuts

## Testing PWA Installation

1. Build the app: `npm run build`
2. Serve the build: `npm run preview` or use a local server
3. Open in Chrome/Edge and check:
   - Install prompt appears (if installable)
   - App can be installed via browser menu
   - App runs in standalone mode when installed

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet

## Notes

- PWA requires HTTPS in production (or localhost for development)
- Service worker must be served from the root domain
- Icons are required for installation prompt to appear

