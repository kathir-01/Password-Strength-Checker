<div align="center">

  <img src="https://img.shields.io/badge/SECURITY-CYBERENGINE-06B6D4?style=for-the-badge&logo=shield&logoColor=white" alt="Security Shield Banner" />

  # 🛡️ SecurePass Analyzer 🔐
  ### *Next-Generation Cybersecurity Password Intelligence & Strong Passcode Engine*

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Web Crypto API](https://img.shields.io/badge/Web%20Crypto-API-22C55E?style=for-the-badge&logo=lock&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
  [![Responsive](https://img.shields.io/badge/Design-Responsive-06B6D4?style=for-the-badge&logo=responsive&logoColor=white)](#responsive-design)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

  <br />

  <p align="center">
    <strong>SecurePass Analyzer</strong> is a premium, client-side cybersecurity web application designed to evaluate password strength in real time, calculate mathematical bit entropy, estimate offline GPU brute-force crack time, and generate cryptographically secure passwords.
  </p>

  <p align="center">
    <a href="https://yourusername.github.io/SecurePass-Analyzer/"><strong>🌐 View Live Demo</strong></a>
    ·
    <a href="#-installation"><strong>⚡ Quickstart</strong></a>
    ·
    <a href="#-contributing"><strong>🤝 Contribute</strong></a>
  </p>

  ---
</div>

<br />

## 📖 Project Overview

**SecurePass Analyzer** provides an intuitive, high-performance cybersecurity dashboard for evaluating password vulnerability. Operating 100% locally in the browser with zero external server dependencies, it guarantees absolute privacy while calculating mathematical entropy ($E = L \log_2 R$), estimating brute-force cracking speeds against modern GPU clusters (~10 Billion hashes/sec), validating character diversity rules, and providing actionable security recommendations.

---

## 🌐 Live Demo

🔗 **Live Application URL:** [https://yourusername.github.io/SecurePass-Analyzer/](https://yourusername.github.io/SecurePass-Analyzer/)

---

## ✨ Features

- ⚡ **Real-Time Analysis:** Instant strength scoring (0–100 index) as you type.
- 📊 **Animated Strength Meter:** Fluid, color-shifting progress bar (`Very Weak` ➔ `Very Strong`).
- ✅ **Live Requirements Checklist:** Dynamic visual indicators (✓/✖) for length, uppercase, lowercase, numbers, and special characters.
- 🧮 **Password Entropy Calculation:** Accurate logarithmic bit entropy evaluation ($E = L \log_2 R$).
- ⏱️ **Crack Time Estimation:** Brute-force time calculations based on $10^{10}$ guesses/sec GPU hashing.
- 🔑 **Cryptographically Secure Generator:** Leverages `Web Crypto API` (`crypto.getRandomValues`) to generate unhackable random passwords.
- 📋 **1-Click Copy & Toast Notifications:** Instant clipboard copying with sleek floating toast popups.
- 👁️ **Show / Hide Password:** Seamless toggle for password visibility.
- 🌙 **Dark / Light Mode Toggle:** Smooth theme transitions with `localStorage` persistence and automatic OS system preference detection.
- 💡 **Smart Recommendations Engine:** Real-time warnings against common dictionary words, repeated characters, and keyboard walks (e.g. `qwerty`, `1234`).
- 📱 **Fully Responsive Design:** Optimized for Desktop, Tablet, and Mobile screens.
- ♿ **Accessibility Support:** High contrast ratios, semantic HTML5, keyboard focus indicators, and full ARIA attributes.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessibility landmarks, ARIA markup, inline SVGs |
| **CSS3** | Glassmorphism design system, CSS Custom Variables, Flexbox, Grid, keyframe animations |
| **JavaScript (ES6+)** | Modular object-oriented architecture, real-time algorithms, DOM event handlers |
| **Web Crypto API** | Cryptographically strong pseudo-random number generator (`getRandomValues`) |
| **Local Storage API** | Theme preference persistence across browser sessions |

---

## 📸 Screenshots

<div align="center">

### 🌙 Dark Mode View
![Dark Mode Screenshot](https://via.placeholder.com/800x450/0B1120/22C55E?text=SecurePass+Analyzer+-+Dark+Mode+Dashboard)

<br />

### ☀️ Light Mode View
![Light Mode Screenshot](https://via.placeholder.com/800x450/F1F5F9/0891B2?text=SecurePass+Analyzer+-+Light+Mode+Dashboard)

<br />

### 🔑 Password Generator & Recommendations
![Generator Screenshot](https://via.placeholder.com/800x450/0F172A/FACC15?text=SecurePass+Analyzer+-+Password+Generator)

<br />

### 📱 Mobile Responsive View
![Mobile View Screenshot](https://via.placeholder.com/400x650/0B1120/22C55E?text=Mobile+Responsive+View)

</div>

---

## 📂 Folder Structure

```text
SecurePass-Analyzer/
├── index.html         # Main semantic HTML5 markup & inline FOUC theme script
├── style.css          # Core CSS variables, glassmorphism UI, light/dark themes
├── script.js           # Modular JS logic (Analyzer, Generator, Theme, UI)
├── README.md          # Comprehensive project documentation
└── LICENSE            # MIT License agreement
```

---

## 📥 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/SecurePass-Analyzer.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd SecurePass-Analyzer
   ```

3. **Launch the application:**
   - Double-click `index.html` to open directly in any standard browser.
   - Alternatively, serve locally using Python or Node:
     ```bash
     # Using Python
     python -m http.server 3000

     # Using Node npx
     npx serve .
     ```
   - Open your browser at `http://localhost:3000`.

---

## 🎮 Usage

1. **Check Password Strength:**
   - Type or paste any password into the main input box.
   - Observe the live strength score, rating badge, bit entropy, estimated crack time, and active checklist.
2. **Generate Strong Passwords:**
   - Adjust the length slider (8 to 32 characters).
   - Select character options (Uppercase, Lowercase, Numbers, Symbols) or pick a **Quick Preset**.
   - Click **Generate Password**.
3. **Copy & Analyze:**
   - Click **Copy** to save the generated password to your clipboard.
   - Click **Analyze** to automatically feed the passcode into the analyzer input.
4. **Switch Theme:**
   - Click the Sun ☀️ / Moon 🌙 button in the header navigation to toggle between Light and Dark themes.

---

## 🚀 Future Improvements

- 🔍 **Have I Been Pwned API Integration:** Optional k-Anonymity API lookup for leaked passwords.
- 🎨 **Multiple Color Themes:** Cyberpunk, Neon Matrix, Solarized Light, and Midnight Blue presets.
- 🌐 **Multi-Language Support (i18n):** Internationalization for Spanish, French, German, and Hindi.
- 📄 **Export Password Security Report:** Download PDF / JSON summary of password audit metrics.
- 📱 **Progressive Web App (PWA) Support:** Offline installability on mobile and desktop devices.
- 🤖 **AI-Powered Password Suggestions:** Smart context-aware passphrase generation.

---

## 🤝 Contributing

Contributions are always welcome! Follow these steps to contribute:

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Your Changes:**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📊 GitHub Repository Stats

<div align="center">

| 🌟 Stars | 🔀 Forks | ⚠️ Open Issues |
| :---: | :---: | :---: |
| ![GitHub stars](https://img.shields.io/github/stars/yourusername/SecurePass-Analyzer?style=social) | ![GitHub forks](https://img.shields.io/github/forks/yourusername/SecurePass-Analyzer?style=social) | ![GitHub issues](https://img.shields.io/github/issues/yourusername/SecurePass-Analyzer) |

</div>

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more details.

---

## 👨‍💻 Author

Created with ❤️ by **Kathiravan SK**

- **GitHub:** [@yourusername](https://github.com/kathir-01)
- **LinkedIn:** [Kathiravan SK](https://linkedin.com/in/yourusername)

<div align="center">
  <br />
  <p><i>If you found this project helpful, please consider giving it a 🌟 on GitHub!</i></p>
</div>
