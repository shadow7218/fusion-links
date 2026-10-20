# LiquidGlass Hub (iOS 27 / visionOS Edition)

**LiquidGlass Hub** is a zero-dependency, progressive single-page web application (PWA) crafted with an Apple iOS 27 / visionOS "Liquid Glass" design system. It combines four core modules into one workspace:

1. **🎵 Sonic Spatial Audio Player**: HTML5 `<audio>` player with a real-time Web Audio API frequency bar visualizer, rotating vinyl glass art, built-in synthesized stereo tracks (so it plays out-of-the-box offline), and drag-and-drop local audio file support.
2. **📺 Cinema YouTube Theatre**: Privacy-enhanced (`youtube-nocookie.com`) video stage with URL/ID auto-extraction and a persistent thumbnail playlist grid.
3. **🔗 Nexus Link Sharing Hub**: Bookmark manager with automatic domain favicons, category filtering, debounced search, one-click clipboard copy, mobile Web Share API integration, and instant QR Code modal generation.
4. **✨ Prism Redemption Vault ("Redimate")**: Interactive code redemption engine with a 60fps canvas confetti burst that unlocks new animated gradient mesh shaders.

---

## 🚀 Deploying to GitHub Pages (No Build Step Required)

1. Create a new repository on GitHub (e.g., `liquidglass-hub`).
2. Upload all 6 files to the root of your repository:
   - `index.html`
   - `style.css`
   - `script.js`
   - `manifest.json`
   - `sw.js`
   - `README.md`
3. Go to your repository **Settings** → **Pages** (on the left sidebar).
4. Under **Build and deployment** → **Branch**, select `main` (or `master`) and `/ (root)`, then click **Save**.
5. Wait ~60 seconds. Your app will be live at `https://<your-username>.github.io/liquidglass-hub/`!

---

## 🛠️ Customization Guide

### 1. Adding or Editing Redeem Codes
Open `script.js` and locate `REDEEM_CODES_CONFIG` near the top of the file:

```javascript
const REDEEM_CODES_CONFIG = {
  "GLASS-2025": {
    themeId: "aurora",
    title: "Aurora Borealis Shader",
    message: "Unlocked the Aurora Borealis environment!"
  },
  // Add your own code here:
  "VIP-999": {
    themeId: "cosmos",
    title: "Supernova Gold",
    message: "VIP Code Accepted!"
  }
};
