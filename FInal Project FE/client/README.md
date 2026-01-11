# 🏠 Ceylon Stay - Boarding Place Platform

> **The Most Trustworthy Boarding Place Platform in Sri Lanka**

A modern, full-featured web application connecting boarding place owners with tenants across Sri Lanka. Built with React, featuring multi-language support, dark mode, and beautiful animations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🎨 **Modern UI/UX**

- **Glassmorphism Design** - Premium, modern aesthetic
- **Dark/Light Mode** - Seamless theme switching with persistence
- **Smooth Animations** - Framer Motion powered interactions
- **Fully Responsive** - Perfect on mobile, tablet, and desktop

### 🌍 **Multi-Language Support**

- 🇬🇧 English
- 🇱🇰 Sinhala (සිංහල)
- 🇱🇰 Tamil (தமிழ்)

### 🏘️ **Core Functionality**

- **Property Listings** - Browse verified boarding places
- **Advanced Search** - Filter by province, district, price, type
- **Property Details** - Comprehensive information with image galleries
- **User Authentication** - Register as tenant or owner
- **Contact Owners** - Direct communication with property owners

### 🎯 **Technical Highlights**

- **React 19** - Latest React features
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive grid system
- **Framer Motion** - Advanced animations
- **Context API** - State management

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to the client folder**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation with theme toggle
│   │   └── Footer.jsx       # Footer component
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Listings.jsx     # Property listings
│   │   ├── PropertyDetails.jsx
│   │   ├── Register.jsx     # User registration
│   │   └── Login.jsx        # User login
│   ├── contexts/            # React contexts
│   │   └── LanguageContext.jsx  # Multi-language support
│   ├── assets/              # Static assets
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles (868 lines)
├── public/                  # Public assets
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

---

## 🎨 Design System

### Color Palette

```css
/* Light Mode */
--primary-color: #00796b; /* Rich Teal */
--primary-dark: #004d40;
--primary-light: #4db6ac;
--accent-color: #ffb300; /* Vibrant Amber */

/* Dark Mode */
--primary-color: #4db6ac; /* Brighter Teal */
--text-dark: #f5f5f5; /* Light text */
--bg-white: #1e1e1e; /* Dark background */
```

### Typography

- **Font Family:** Poppins (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800

### Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 991px
- **Desktop:** ≥ 992px

---

## 🔧 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🌟 Key Features Explained

### 1. **Language Switching**

The app supports three languages with full translations:

- Persistent language preference (localStorage)
- Instant switching without page reload
- Complete UI translations

### 2. **Dark Mode**

- System preference detection
- Manual toggle
- Smooth transitions
- Persistent across sessions

### 3. **Search Functionality**

- Province/District cascading dropdowns
- Property type filtering
- Price range selection
- Client type filtering (Girls/Boys/Couples/Family)

### 4. **Animations**

- Scroll-triggered reveals
- Hover effects on cards
- Page transitions
- Loading states

---

## 📱 Pages Overview

### 🏠 **Home Page**

- Hero section with video background
- Search box with filters
- Featured properties
- About section
- Statistics section

### 📋 **Listings Page**

- Sidebar filters
- Property grid
- Sorting options
- Pagination

### 🏘️ **Property Details**

- Image carousel
- Property information
- Facilities list
- Location map
- Owner contact section
- Safety tips

### 👤 **Register/Login**

- User authentication
- Role selection (Tenant/Owner)
- Form validation
- Responsive design

---

## 🎯 Future Enhancements

### Phase 1: Backend Integration

- [ ] Firebase/Supabase integration
- [ ] Real property data
- [ ] User authentication
- [ ] Property CRUD operations

### Phase 2: Advanced Features

- [ ] Image upload
- [ ] Favorites/Wishlist
- [ ] Reviews and ratings
- [ ] Chat system
- [ ] Payment integration

### Phase 3: Optimization

- [ ] SEO improvements
- [ ] Performance optimization
- [ ] PWA support
- [ ] Analytics integration

---

## 🐛 Known Issues

1. **No Backend** - Currently frontend-only with mock data
2. **Form Submissions** - Not connected to database
3. **Image Upload** - Not implemented
4. **User Sessions** - No persistent authentication

---

## 📚 Technologies Used

| Technology      | Version  | Purpose          |
| --------------- | -------- | ---------------- |
| React           | 19.2.0   | UI Framework     |
| Vite            | 7.2.4    | Build Tool       |
| React Router    | 7.10.1   | Routing          |
| Bootstrap       | 5.3.8    | CSS Framework    |
| Framer Motion   | 12.23.26 | Animations       |
| React Bootstrap | 2.10.10  | React Components |
| Font Awesome    | 6.4.0    | Icons            |
| Google Fonts    | -        | Typography       |

---

## 👥 Team

**Developed by:** The Dark Code Team

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

- **Email:** info@ceylonstay.lk
- **Phone:** +94 714 95 95 96
- **Address:** 123, Main Street, Colombo 03, Sri Lanka

---

## 🙏 Acknowledgments

- Design inspiration from modern real estate platforms
- Images from Unsplash
- Icons from Font Awesome
- Fonts from Google Fonts

---

## 📝 Changelog

### Version 1.0.0 (January 11, 2026)

- ✅ Consolidated to React-only architecture
- ✅ Full multi-language support
- ✅ Dark mode implementation
- ✅ Responsive design
- ✅ All core pages completed
- ✅ Animation system implemented

---

**Made with ❤️ in Sri Lanka**
