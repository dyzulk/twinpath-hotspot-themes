# Twinpath Hotspot Themes 🎨📶

Professional, modern, and multi-themed captive portal templates for MikroTik Hotspot.

## ✨ Features
- **Dynamic Branching**: Every branch in this repository represents a different theme/variant.
- **Premium Aesthetics**: Dark modes, vibrant accents, and modern typography.
- **Multi-language Support**: Built-in Indonesian (ID) and English (EN) localization.
- **QR Code Connectivity**: Integrated QR scanner for quick login from vouchers.

## 🚀 How to Use

### 1. Choose Your Theme
Check out the available branches to find the theme that suits your brand:
- `theme/premium-gold` (Current active theme: Gold accents with dark background)

### 2. Implementation
It is highly recommended to use a specific **Tag** for a stable release:

1. Clone using a stable tag (e.g., `gold-v1.0`):
   ```bash
   git clone --branch gold-v1.0 https://github.com/dyzulk/twinpath-hotspot-themes.git
   ```
2. Or, if you want the latest (possibly experimental) version of a branch:
   ```bash
   git clone -b theme/premium-gold https://github.com/dyzulk/twinpath-hotspot-themes.git
   ```
3. Upload the contents of the folder to your MikroTik **`flash/hotspot`** directory.

## 📁 Repository Structure
Each branch is self-contained. To switch themes in your local development:
```bash
git checkout theme/[branch-name]
```

## 🛠️ Customization
Edit `js/config.js` to change branding, URLs, and basic settings without touching the core HTML/CSS.

---
Developed with ❤️ by [dyzulk](https://github.com/dyzulk)
