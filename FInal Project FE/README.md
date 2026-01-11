# 🏠 Ceylon Stay - Project Root

## 📂 Project Structure

This repository has been **consolidated to React-only architecture** (January 11, 2026).

```
📁 FP-Ongoing-FrontEnd/
├── 📁 client/                    ← **ACTIVE PROJECT** (React App)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md                 ← Full documentation here
│
├── 📁 archive-static-version/    ← Old HTML/CSS/JS version (archived)
│   └── README.md                 ← Why it was archived
│
├── 📁 app/                        ← (Legacy/Unknown - may be old build)
│
└── README.md                      ← You are here
```

---

## 🚀 Getting Started

### **Use the React Application**

1. **Navigate to the client folder:**

   ```bash
   cd client
   ```

2. **Read the full documentation:**

   ```bash
   cat README.md
   # or open client/README.md in your editor
   ```

3. **Install and run:**

   ```bash
   npm install
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

---

## ✅ What Changed?

### Before (Dual Architecture)

```
❌ Static HTML version (root)
❌ React version (client)
❌ Code duplication
❌ Maintenance nightmare
```

### After (React-Only)

```
✅ Single React application
✅ No code duplication
✅ Modern architecture
✅ Easy to maintain
```

---

## 📁 Folder Explanations

### **client/** ⭐ **USE THIS**

The **main React application**. All development should happen here.

**Features:**

- React 19 + Vite
- Multi-language support (EN/SI/TA)
- Dark/Light mode
- Responsive design
- Framer Motion animations

**[Read Full Documentation →](client/README.md)**

---

### **archive-static-version/** 📦 **ARCHIVED**

The old static HTML/CSS/JS version. **Do not use.**

Kept only for:

- Reference
- Emergency rollback
- Learning comparison

**[Why It Was Archived →](archive-static-version/README.md)**

---

### **app/** ❓ **UNKNOWN**

Appears to be an old build or duplicate. Status unclear.

**Recommendation:** Review and delete if not needed.

---

## 🎯 Quick Commands

```bash
# Start development
cd client && npm run dev

# Build for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Run linter
cd client && npm run lint
```

---

## 📚 Documentation

- **Main Documentation:** [client/README.md](client/README.md)
- **Consolidation Plan:** [CONSOLIDATION_PLAN.md](CONSOLIDATION_PLAN.md)
- **Archive Info:** [archive-static-version/README.md](archive-static-version/README.md)

---

## 🤔 FAQ

### Q: Which version should I use?

**A:** Use the **client/** folder (React version).

### Q: Can I use the static HTML version?

**A:** No, it's archived. Use React version instead.

### Q: Where is the main code?

**A:** In **client/src/** folder.

### Q: How do I run the project?

**A:** `cd client && npm install && npm run dev`

### Q: Is the static version deleted?

**A:** No, it's archived in **archive-static-version/** for reference.

---

## 🔧 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router 7
- **Styling:** Bootstrap 5 + Custom CSS
- **Animations:** Framer Motion
- **Language:** JavaScript (ES6+)

---

## 👥 Team

**Developed by:** The Dark Code Team

---

## 📞 Support

- **Email:** info@ceylonstay.lk
- **Phone:** +94 714 95 95 96

---

## 📝 Version History

### v1.0.0 (January 11, 2026)

- ✅ Consolidated to React-only architecture
- ✅ Archived static HTML version
- ✅ Updated documentation
- ✅ Cleaned project structure

---

**🚀 Ready to start? Navigate to the [client folder](client/) and read the [README](client/README.md)!**
