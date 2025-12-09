# 🚀 Quick Start Guide

## ⚡ Get Started in 3 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Configure Database (30 sec)
Edit `.env` file:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/procurement_db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Step 3: Setup Database (1 min)
```bash
npm run db:push
npm run db:seed
```

### Step 4: Start Application (30 sec)
```bash
npm run dev
```

**That's it! 🎉** Your app should now be running!

---

## 🪟 Windows Users - Even Easier!

Just double-click: **`start.bat`**

This will:
1. Install dependencies (if needed)
2. Create .env file (if needed)
3. Start the application

---

## 📋 Common Commands

```bash
# Development
npm run dev              # Start app in development mode
npm run dev:vite         # Start Vite only
npm run dev:electron     # Start Electron only

# Database
npm run db:push          # Push schema to database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data

# Build
npm run build            # Build for production
npm run package          # Create installer

# Preview
npm run preview          # Preview production build
```

---

## 🎯 What You Get

### Features
- ✅ Items Management
- ✅ Purchase Orders
- ✅ Goods Receipt Notes (GRN)
- ✅ Sales Receipts
- ✅ Inventory Tracking
- ✅ Vendor Management
- ✅ Category Management
- ✅ Warehouse Management
- ✅ User Authentication

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Drizzle ORM + PostgreSQL
- **Desktop**: Electron with secure IPC
- **State**: Zustand
- **Build**: Vite

---

## 🔍 Verify Installation

### Check if everything works:

1. **Application Opens** ✓
   - Electron window should open
   - No console errors

2. **Database Connected** ✓
   - Check terminal for "Database connected successfully"

3. **UI Loads** ✓
   - React app loads in Electron window
   - Can navigate between pages

4. **IPC Works** ✓
   - Can fetch data (items, categories, etc.)
   - Can create new records

---

## 🐛 Troubleshooting

### Issue: npm install fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### Issue: Database connection fails
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection:
psql -U your_user -d procurement_db
```

### Issue: Port 5173 already in use
```bash
# Windows: Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

### Issue: Electron doesn't start
```bash
# Rebuild Electron
npm run build:electron
npm run dev
```

---

## 📚 Next Steps

### 1. Explore the App
- Login page (if auth is enabled)
- Dashboard
- Items management
- Purchase orders
- Inventory tracking

### 2. Read Documentation
- `README_NEW.md` - Complete guide
- `STRUCTURE.md` - Architecture details
- `MIGRATION_GUIDE.md` - If migrating from old version

### 3. Start Developing
- Add new features
- Customize UI
- Extend functionality

---

## 🎓 Key Concepts

### IPC Communication
```typescript
// In React components
const items = await window.api.getItems();
```

### Adding New Feature
1. Create service in `backend/services/`
2. Create IPC handler in `electron/ipc/`
3. Expose in `electron/preload.ts`
4. Use in React via `window.api`

### Database Changes
1. Update `backend/src/db/schema.ts`
2. Run `npm run db:push`
3. Update services as needed

---

## 💡 Tips

### Development
- Use React DevTools in Electron
- Check console for errors
- Use TypeScript for type safety

### Database
- Backup before migrations
- Use transactions for data integrity
- Index frequently queried columns

### Performance
- IPC is fast (1-5ms)
- Use React.memo for optimization
- Lazy load heavy components

---

## 🆘 Need Help?

### Check These First
1. Console errors in DevTools
2. Terminal output
3. Database connection
4. .env configuration

### Documentation
- `README_NEW.md` - Full documentation
- `MIGRATION_GUIDE.md` - Migration help
- `STRUCTURE.md` - Architecture guide
- `IMPLEMENTATION_SUMMARY.md` - What's included

### Common Solutions
- Restart the app
- Clear node_modules and reinstall
- Check database is running
- Verify .env file

---

## ✅ Checklist

Before you start developing:

- [ ] Dependencies installed (`npm install`)
- [ ] .env file configured
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Schema pushed (`npm run db:push`)
- [ ] Sample data seeded (`npm run db:seed`)
- [ ] App starts successfully (`npm run dev`)
- [ ] No console errors
- [ ] Can navigate UI
- [ ] Can fetch data
- [ ] Can create records

---

## 🎉 You're Ready!

Your Electron app is now running with:
- ✅ Secure architecture
- ✅ Fast IPC communication
- ✅ Clean codebase
- ✅ Production-ready structure

**Happy coding! 🚀**

---

## 📞 Quick Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Create installer
npm run package

# Database operations
npm run db:push    # Push schema
npm run db:seed    # Seed data

# Help
npm run --help
```

---

**Time to first run**: ~3 minutes
**Difficulty**: Easy
**Prerequisites**: Node.js, PostgreSQL
**Support**: Check documentation files

---

*Last updated: 2024*
*Version: 1.0.0*
