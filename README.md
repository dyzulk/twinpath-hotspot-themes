<div align="center">
  <img src="img/logo-twinpath.svg" alt="TwinpathNet Logo" width="120" height="auto" />
  <br/>
  <h1>TwinpathNet Hotspot Theme</h1>
  <p>A high-performance, Vercel-inspired Mikrotik Hotspot template designed for modern ISPs.</p>

  <p>
    <a href="https://github.com/dyzulk/twinpath-hotspot-themes/releases">
      <img src="https://img.shields.io/github/v/release/dyzulk/twinpath-hotspot-themes?style=for-the-badge&logo=github&color=000000&labelColor=000000" alt="Release" />
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Mikrotik-RouterOS%20v7-000000?style=for-the-badge&logo=mikrotik&logoColor=white&labelColor=000000" alt="Mikrotik" />
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Design-Vercel%20Style-000000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=000000" alt="Design System" />
    </a>
    <a href="#">
       <img src="https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&labelColor=000000" alt="License" />
    </a>
  </p>
</div>

---

## ✨ Features

### 🎨 **Vercel-Inspired UI**
Built with a sleek, dark-mode-first prioritization. Minimalist aesthetics that focus on content and typography, providing a premium feel for end-users.

### 🛡️ **Advanced Security**
- **API Hardening**: Automatically hides details of unused vouchers (0 uptime/bytes) to prevent enumeration attacks.
- **Form Isolation**: 'Info Check' logic is physically separated from the main login form, preventing accidental logins.
- **Input Guard**: Native `Enter` key handling preventing unwanted form submissions.

### ⚡ **Smart QR Scanner**
- **Context-Aware**: Intelligently switches between "Login Mode" and "Check Status Mode".
- **Fast Path**: Instantly processes scanned codes without unnecessary confirmation dialogs when checking status.
- **Auto Cleanup**: Modals automatically close when switching tabs or pressing `Escape`.

### 🌐 **Multi-Language Support**
- **Native Localization**: Built-in JSON-based translation engine (ID/EN).
- **Auto-Detect**: Remembers user preference via LocalStorage.

---

## 🚀 Installation

1. **Download Release**
   Grab the latest `.zip` from the [Releases Page](https://github.com/dyzulk/twinpath-hotspot-themes/releases).

2. **Drag & Drop**
   Extract the folder and upload it to your Mikrotik's `Files` menu via Winbox or FTP.

3. **Configure Profile**
   Go to `IP > Hotspot > Server Profiles`, select your profile, and point `HTML Directory` to the uploaded folder.

---

## 🛠️ Configuration

Open `js/config.js` to customize your brand:

```javascript
const brandConfig = {
    brandName: "TwinpathNet",
    portalUrl: "http://h.twinpath.net", // Your Hotspot DNS Name
    mikhmonUrl: "https://mikhmon.dyzulk.com", // Your Mikhmon API URL
    mikhmonSession: "Twinpath-Net" // Your Mikhmon Session Name
};
```

---

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x450/000000/FFFFFF?text=Login+Screen" alt="Login Screen" width="48%" />
  <img src="https://via.placeholder.com/800x450/000000/FFFFFF?text=Voucher+Check" alt="Voucher Check" width="48%" />
</div>

---

<div align="center">
  <p>Crafted with ❤️ by <a href="https://github.com/dyzulk"><b>@dyzulk</b></a></p>
  <p>
    <small>Powered by Mikrotik & Vanilla JS</small>
  </p>
</div>
