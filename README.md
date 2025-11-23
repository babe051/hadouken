# 🎮 Hadouken - Konami Code Game

**"This is better than Hadouken !"**

An interactive game based on the famous Konami code, featuring stunning 3D effects, achievement system, difficulty levels, customizable themes, and an advanced combo system.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Contributing](#contributing)

---

## 🎯 Overview

Hadouken is a modern React application that transforms the classic Konami code into an immersive gaming experience with:

- ✨ **3D Effects** : WebGL particle system with Three.js
- 🏆 **Achievement System** : 7 unlockable achievements
- ⏱️ **Timer Mode** : Challenge yourself with real-time timer
- 🎨 **Customizable Themes** : 4 different visual themes
- 📊 **Difficulty Levels** : 4 levels (Easy to Expert)
- 🔥 **Combo System** : Speed-based bonuses
- 🎵 **Interactive Sounds** : Audio feedback for every action

---

## ✨ Features

### 🎮 Gameplay

- **Random Sequences** : Each game generates a unique new sequence
- **Real-time Validation** : Immediate visual feedback (green = correct, red = error)
- **Shake Effect** : Shake animation on error
- **Progress Bar** : Visual tracking of your progress

### 🏆 Achievement System

1. **🎯 First Steps** - Complete the code for the first time
2. **⚡ Speed Demon** - Complete in less than 3 seconds
3. **⚡⚡ Lightning Fast** - Complete in less than 5 seconds
4. **✨ Perfect Timing** - Complete without any errors
5. **🦉 Night Owl** - Complete between midnight and 6 AM
6. **👑 Konami Master** - Complete 10 times
7. **🔥 Perfect Streak** - 5 perfect consecutive completions

### 📊 Difficulty Levels

| Level | Keys | Multiplier | Icon |
|-------|------|------------|------|
| **Easy** | 5 | ×1.0 | 🌱 |
| **Normal** | 10 | ×1.5 | ⭐ |
| **Hard** | 15 | ×2.0 | 🔥 |
| **Expert** | 20 | ×3.0 | 💀 |

### 🎨 Visual Themes

- **🌙 Dark** : Default theme with purple gradients
- **💡 Neon** : Cyberpunk theme with cyan neon effects
- **🎮 Retro** : Retro gaming theme with warm colors
- **💜 Purple** : Elegant purple theme

### 🔥 Combo System

The combo system rewards execution speed:

| Rating | Timing | Multiplier |
|--------|--------|------------|
| **PERFECT!** | < 500ms | ×2.0 |
| **GOOD!** | < 1000ms | ×1.5 |
| **OK** | < 2000ms | ×1.0 |
| **MISS** | > 2000ms | ×0.5 |

**Final Score** = (Base Score × Combo Multiplier × Difficulty Multiplier)

### 🎵 Audio System

- Unique sound for each key (↑ ↓ ← → B A)
- Error sound for wrong keys
- Success sound on completion
- Real-time sound generation with Web Audio API

---

## 🚀 Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd hadouken
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

---

## 🎯 Usage

### Quick Start

1. **Select Difficulty** : Choose your level (Easy, Normal, Hard, Expert)
2. **Choose Theme** : Select your preferred visual theme
3. **Start Playing** : Use arrow keys (↑ ↓ ← →) and letters (B, A) to enter the displayed sequence
4. **Get Combos** : Press keys quickly to get PERFECT or GOOD ratings
5. **Unlock Achievements** : Complete challenges to unlock achievements

### Controls

- **Arrow Keys** : ↑ ↓ ← →
- **Letters** : B, A
- **Escape** : Close celebration page

### Tips for High Scores

- ✅ Enter keys quickly to get PERFECT combos
- ✅ Choose a high difficulty level for better multiplier
- ✅ Avoid errors to maintain your combo
- ✅ Practice to improve your reaction time

---

## 📁 Project Structure

```
hadouken/
├── public/                 # Static files
│   ├── index.html
│   └── ...
├── src/
│   ├── components/         # React components
│   │   ├── AchievementNotification.js
│   │   ├── CelebrationPage.js
│   │   ├── ComboDisplay.js
│   │   ├── DifficultySelector.js
│   │   ├── ParticleSystem3D.js
│   │   ├── ThemeSelector.js
│   │   ├── TimerDisplay.js
│   │   └── ...
│   ├── constants/          # Constants and configurations
│   │   ├── difficulty.js
│   │   ├── konami.js
│   │   └── themes.js
│   ├── hooks/              # Custom React hooks
│   │   └── useKonamiCode.js
│   ├── utils/              # Utilities
│   │   ├── achievements.js
│   │   ├── combo.js
│   │   └── sounds.js
│   ├── App.js              # Main component
│   ├── App.css             # Main styles
│   └── index.js            # Entry point
├── package.json
└── README.md
```

---

## 🛠️ Technologies Used

### Core
- **React 19.2.0** - UI library
- **React DOM 19.2.0** - React rendering

### 3D & Graphics
- **Three.js 0.169.0** - WebGL 3D library
- **postprocessing 6.35.0** - Post-processing effects
- **ogl 1.0.0** - Lightweight WebGL library

### Animations
- **GSAP 3.12.5** - Advanced animations
- **Framer Motion 11.0.0** - React animations

### Audio
- **Web Audio API** - Real-time sound generation

### Utilities
- **PropTypes 15.8.1** - Props validation
- **face-api.js 0.22.2** - Face detection (optional)

### Testing
- **@testing-library/react** - React testing
- **@testing-library/jest-dom** - Jest DOM matchers

---

## ⚙️ Configuration

### Environment Variables

The project uses `react-scripts` which supports environment variables via `.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

### LocalStorage

The project uses localStorage to save:
- **Achievements** : `hadouken_achievements`
- **Statistics** : `hadouken_stats`
- **Difficulty** : `hadouken_difficulty`
- **Theme** : `hadouken_theme`

### Customization

#### Adding a New Theme

Edit `src/constants/themes.js`:

```javascript
export const THEMES = {
  // ... existing themes
  CUSTOM: {
    id: 'custom',
    name: 'Custom',
    icon: '🎨',
    colors: {
      primary: '#...',
      secondary: '#...',
      // ...
    }
  }
};
```

#### Adding a New Difficulty Level

Edit `src/constants/difficulty.js`:

```javascript
export const DIFFICULTY_LEVELS = {
  // ... existing levels
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary',
    sequenceLength: 25,
    multiplier: 5.0,
    color: '#...',
    icon: '👑'
  }
};
```

---

## 📜 Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3000`

### `npm test`
Launches the test runner in watch mode

### `npm run build`
Creates an optimized production build in the `build/` folder

### `npm run eject`
**⚠️ Irreversible** - Ejects Create React App configuration

---

## 🔧 Development

### Architecture

The project follows a modular architecture:

- **Components** : Reusable React components
- **Hooks** : Reusable business logic
- **Constants** : Centralized configuration
- **Utils** : Utility functions

### Best Practices

- ✅ PropTypes for validation
- ✅ Error handling with ErrorBoundary
- ✅ Performance optimization (useMemo, useCallback)
- ✅ Accessibility (ARIA labels)
- ✅ Modular and reusable code

### Future Improvements

- [ ] Local Leaderboard (Top 10)
- [ ] Local Multiplayer Mode
- [ ] Export/Import Statistics
- [ ] More Customizable Themes
- [ ] Practice Mode with Sequence Display
- [ ] Daily Challenges
- [ ] Detailed Statistics Charts

---

## 🐛 Troubleshooting

### Common Issues

**Application won't start**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Sounds don't work**
- Check that your browser supports Web Audio API
- Some browsers require user interaction before playing sounds

**3D effects are slow**
- Reduce particle count in `ParticleSystem3D`
- Check your GPU performance

**Data doesn't save**
- Check that localStorage is enabled in your browser
- Clear cache if necessary

---

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 👥 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- Inspiration from the classic Konami code
- React community for tools and resources
- Three.js for 3D capabilities

---

## 📞 Contact

For any questions or suggestions, feel free to open an issue on the repository.

---

**Enjoy the game and have fun! 🎮✨**

*"This is better than Hadouken !"*
