<div align="center">

# 🎬 RatingX

**The modern desktop catalog to search, organize, and rate films, series, and anime on a 0/10 scale.**

[![GitHub Release](https://img.shields.io/github/v/release/davCreate/RatingX?color=7C3AED&style=for-the-badge&logo=github)](https://github.com/davCreate/RatingX/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-blue?style=for-the-badge&logo=windows)](https://github.com/davCreate/RatingX/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

<br/>

[📥 **Download Windows Installer (.exe)**](https://github.com/davCreate/RatingX/releases/download/v1.0.0/RatingX.Setup.1.0.0.exe) &nbsp;&bull;&nbsp; [⚡ **Download Portable (.exe)**](https://github.com/davCreate/RatingX/releases/download/v1.0.0/RatingX-Portable-1.0.0.exe) &nbsp;&bull;&nbsp; [📦 **All Releases**](https://github.com/davCreate/RatingX/releases)

<br/>

![RatingX Preview](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80)

</div>

---

## 🌟 Highlights

RatingX gives cinema lovers, binge watchers, and anime fans a sleek, distraction-free desktop application to curate their entertainment life.

- 🔍 **Universal Search**: Instantly discover movies, TV series, and anime with poster art, release years, synopsis, and genres. Powered by TMDB & Jikan APIs with offline curated fallbacks.
- 📁 **Custom Folders & Sections**: Organize titles however you like with personalized names and custom emoji icons (*e.g.*, 🍿 *Currently Bingeing*, 🔥 *All-Time 10/10s*, 🌸 *Anime Masterpieces*, ⏳ *Backlog*).
- ⭐ **0 to 10 Ratings**: Granular rating system supporting whole numbers and fine-tuned decimals (*e.g.*, `9.4/10`) with personal reviews and timestamps.
- 👤 **Customizable Public Profile**: Personalize your username, avatar, bio, and banner.
- 🌐 **Export Shareable HTML**: Generate a standalone, styled HTML webpage of your rated catalog with 1 click to send to friends.
- 🔄 **Built-in Update Checker**: One-click update check that queries GitHub releases directly from Settings.
- 💾 **Local-First & Data Ownership**: Zero login required. Full JSON export and restore capabilities.
- 🎨 **Fluid Dark Glassmorphism UI**: High refresh-rate Framer Motion page animations, responsive grids, and glowing badges.

---

## 📥 Downloads for Windows

| Package | Format | Description | Link |
|---|---|---|---|
| **Setup Installer** | `.exe` | Standard Windows installation with Start Menu & Desktop shortcuts | [Download (.exe)](https://github.com/davCreate/RatingX/releases/download/v1.0.0/RatingX.Setup.1.0.0.exe) |
| **Portable Version** | `.exe` | No installation needed. Double-click and run directly | [Download (.exe)](https://github.com/davCreate/RatingX/releases/download/v1.0.0/RatingX-Portable-1.0.0.exe) |

*Tested on Windows 10 & Windows 11 (x64).*

---

## 🖥️ App Walkthrough

### 1. Search & Discover
Type any film, anime, or series title in the search bar. Filter by Movies, TV Shows, or Anime tabs.

### 2. Add to Custom Folders
Click **+ Add to List** to file the title into an existing folder or create a new section on the spot.

### 3. Rate & Review
Slide or tap from `0.0` to `10.0`. Jot down your thoughts, favorite quotes, or memorable moments.

### 4. Share Your Profile
Head to **Public Profile** and click **Share / Export HTML** to produce a self-contained portfolio website of your catalog.

---

## 💻 Building from Source

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/davCreate/RatingX.git
cd RatingX

# Install dependencies
npm install

# Run development server with live preview
npm run dev

# Run inside Electron
npm run electron:start

# Compile Windows .exe installer and portable executable
npm run package:win
```

Output binaries will be generated inside the `release/` directory.

---

## ⚙️ Tech Stack

- **Desktop Shell**: [Electron 33](https://www.electronjs.org/)
- **UI Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State & Storage**: [Zustand](https://github.com/pmndrs/zustand) (Local-first persistence)
- **Packaging**: [electron-builder](https://www.electron.build/)

---

## 🤝 Contributing & Feedback

Suggestions and bug reports are welcome! Open an issue or submit a pull request on [GitHub Issues](https://github.com/davCreate/RatingX/issues).

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

Developed with ❤️ by [davCreate](https://github.com/davCreate).
