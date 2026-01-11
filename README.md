# 🏠 Ceylon Stay

> A modern boarding place listing platform for Sri Lanka

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Ceylon Stay connects boarding place owners with potential tenants through a fast, easy, and trustworthy digital platform designed specifically for the Sri Lankan market.

![Ceylon Stay Preview](https://via.placeholder.com/800x400/00796b/ffffff?text=Ceylon+Stay+Preview)

## ✨ Features

- 🎨 **Modern UI/UX** - Glassmorphism design with smooth animations
- 🌓 **Dark Mode** - Seamless theme switching with persistent preferences
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🔍 **Advanced Filtering** - Province/District cascading dropdowns specific to Sri Lanka
- ⚡ **Lightning Fast** - Vite-powered development with sub-second HMR
- 🎭 **Smooth Animations** - Framer Motion integration for premium interactions
- ♿ **Accessible** - WCAG AA compliant with proper semantic HTML
- 🌐 **Multilingual Support** - Built-in language context for future expansion

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn installed
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/dyd298/ceylon-stay.git](https://github.com/DYD298/FP-Ongoing-FrontEnd)
   ```

2. **Navigate to the client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

That's it! The app should now be running. 🎉

## 📁 Project Structure

```
ceylon-stay/
├── client/                      # React Application (Main Codebase)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/              # Route-level components
│   │   │   ├── Home.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Login.jsx
│   │   ├── contexts/           # React Context providers
│   │   │   └── LanguageContext.jsx
│   │   ├── App.jsx             # Main app & routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles (868 lines)
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── archive-static-version/     # Legacy HTML version (archived)
└── README.md
```

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2.0** - Modern UI library with latest features
- **Vite 7.2.4** - Next-generation frontend build tool
- **React Router DOM 7.10.1** - Declarative routing for React

### UI & Styling
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Framer Motion 12.23.26** - Production-ready animation library
- **CSS3** - Custom properties, Grid, Flexbox, Glassmorphism
- **Google Fonts** - Poppins (300-800 weights)

### Development Tools
- **ESLint** - Code quality and consistency
- **Font Awesome 6.4.0** - Icon library

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-teal: #00796b;        /* Trust & Professionalism */
--primary-dark: #004d40;        /* Deep variant */
--primary-light: #4db6ac;       /* Light variant */
--accent-amber: #ffb300;        /* CTAs & Highlights */
```

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Base Size**: 16px (1rem)
- **Scale**: Responsive from 2.5rem (mobile) to 3.5rem (desktop) for hero titles

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: ≥ 992px

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🌟 Key Features Explained

### Glassmorphism UI
Modern frosted-glass effect applied to navigation, search boxes, and cards using `backdrop-filter: blur(10px)` with semi-transparent backgrounds.

### Dark Mode
- Implemented using CSS custom properties
- Persistent theme storage with `localStorage`
- Smooth 0.3s transitions between themes
- WCAG AA contrast ratios maintained

### Advanced Animations
- **Scroll Animations**: Intersection Observer API for performance
- **Hover Effects**: Card lifts, image zoom (1.15x), smooth shadows
- **Page Transitions**: React Router + Framer Motion
- **Performance**: 60fps using `transform` and `opacity` only

### Smart Filtering
- Province/District cascading dropdowns
- Real-time result count updates
- Price range selection
- Property type filtering
- Optimized for Sri Lankan geography

## 🚦 Performance Optimizations

- ✅ Intersection Observer for scroll animations (not scroll listeners)
- ✅ Transform/opacity-only animations for 60fps
- ✅ Lazy-loaded images with proper aspect ratios
- ✅ Vite's optimized build with code splitting
- ✅ Strategic `will-change` hints
- ✅ Sub-600ms dev server startup

## 🎯 Roadmap

- [ ] Backend integration (Node.js + Express)
- [ ] Database setup (MongoDB/PostgreSQL)
- [ ] User authentication & authorization
- [ ] Property booking system
- [ ] Payment gateway integration
- [ ] Reviews & ratings system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced search with map integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Front-End Developer** - [Desan Yasandu](https://github.com/dyd298)

## 📧 Contact

Project Link: [https://github.com/DYD298/FP-Ongoing-FrontEnd]

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Unsplash](https://unsplash.com/) for high-quality images
- [Font Awesome](https://fontawesome.com/) for icons

---

<p align="center">Made with ❤️ for Sri Lanka</p>
<p align="center">
  <a href="#-ceylon-stay">Back to Top ↑</a>
</p>
