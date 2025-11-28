# 📦 ProcureDesk

> A modern, feature-rich Procurement & Inventory Management Desktop Application built with Electron, React, TypeScript, and TailwindCSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Electron](https://img.shields.io/badge/Electron-33.2.1-47848F?logo=electron)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript)

---

## ✨ Features

### 📊 Core Modules

- **Dashboard** - Real-time analytics, KPIs, and business insights
- **Vendors Management** - Track and manage supplier relationships
- **Products Catalog** - Complete product inventory with SKU tracking
- **Purchase Orders** - Create, manage, and track purchase orders
- **Inventory Management** - Real-time stock monitoring and alerts
- **Reports & Analytics** - Comprehensive business intelligence reports
- **Settings** - User preferences and system configuration

### 🎨 UI/UX Highlights

- ✅ Modern, clean, and intuitive interface
- ✅ Dark/Light theme support
- ✅ Responsive design with TailwindCSS
- ✅ Rich data visualizations with Recharts
- ✅ Smooth animations and transitions
- ✅ Toast notifications for user feedback
- ✅ Reusable UI component library

### 🛠️ Technical Stack

- **Framework**: Electron (Desktop Application)
- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: TailwindCSS + Custom CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control) - [Download](https://git-scm.com/)

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd my-electron-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Development

There are two ways to run the application in development mode:

#### Option 1: Run as Web Application (Recommended for UI Development)

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:5173`. Open this URL in your browser to see the application. This mode provides hot module replacement (HMR) for faster development.

#### Option 2: Run as Electron Desktop App

```bash
npm run electron:dev
```

This concurrently starts the Vite dev server and launches the Electron window. This is the full desktop experience.

> **Note**: If you just want to test Electron without the dev server, first start the dev server with `npm run dev`, then in a separate terminal run `npm run electron`.

### Building for Production

1. **Build the web assets**

   ```bash
   npm run build
   ```

   This compiles TypeScript and bundles the application using Vite. The output will be in the `dist` folder.

2. **Preview production build**

   ```bash
   npm preview
   ```

3. **Package as Desktop App** (Coming Soon)
   ```bash
   # Uses electron-builder (configuration needed)
   npm run package
   ```

---

## 📁 Project Structure

```
my-electron-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Sidebar, Topbar, Layout
│   │   ├── ui/             # Button, Modal, DataTable, etc.
│   │   └── ...
│   ├── pages/              # Application pages/routes
│   │   ├── Dashboard.tsx
│   │   ├── Vendors.tsx
│   │   ├── Products.tsx
│   │   ├── PurchaseOrders.tsx
│   │   ├── Inventory.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── data/               # Mock/dummy data files
│   ├── store/              # Zustand state management
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── main.js                 # Electron main process
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

---

## 🧩 Available Scripts

| Command                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Start Vite development server (web mode)          |
| `npm run build`        | Build production bundle                           |
| `npm run preview`      | Preview production build                          |
| `npm run electron`     | Launch Electron app (requires dev server running) |
| `npm run electron:dev` | Start dev server + Electron concurrently          |

---

## 🎯 Usage Guide

### First Launch

1. Start the application using `npm run dev` or `npm run electron:dev`
2. You'll see the **Login** page (UI only, no backend validation)
3. Enter any credentials to access the application
4. Navigate through different modules using the sidebar

### Key Features

#### Dashboard

- View key performance indicators (KPIs)
- Monitor total vendors, products, and purchase orders
- Analyze trends with interactive charts

#### Vendors Management

- Browse all vendors in a sortable, searchable table
- Filter by status (Active/Inactive)
- View vendor details including contact information

#### Products Catalog

- Manage product listings with SKU and categories
- Track stock levels and pricing
- Filter and search products efficiently

#### Purchase Orders

- Create and track purchase orders
- Monitor order status (Pending, Approved, Delivered)
- View order details and amounts

#### Inventory

- Real-time stock monitoring
- Low stock alerts
- Category-based organization

#### Reports

- Generate comprehensive business reports
- Visualize data with charts and graphs
- Export capabilities (UI ready)

---

## 🎨 Customization

### Themes

The app supports both **Light** and **Dark** themes. Toggle using the theme switcher in the Topbar.

### Colors & Styling

Customize the design system by editing:

- `tailwind.config.js` - TailwindCSS theme configuration
- `src/index.css` - Global CSS variables and styles

### Data

Currently uses local dummy data. Update files in `src/data/` to modify:

- `vendors.ts` - Vendor information
- `products.ts` - Product catalog
- `purchaseOrders.ts` - Purchase order records
- `inventory.ts` - Inventory data

---

## 🔧 Tech Stack Details

### State Management

- **Zustand** for global state (theme, user preferences)
- React Context API for route-specific state

### Routing

- React Router DOM v6 with nested routes
- Protected routes (authentication UI)

### Styling Approach

- **TailwindCSS** for utility-first styling
- Custom CSS for complex animations
- CSS variables for theme switching

### Component Architecture

- Functional components with TypeScript
- Props validation with TypeScript interfaces
- Reusable compound components (DataTable, Modal, etc.)

---

## 🐛 Troubleshooting

### White Screen on Electron Launch

- Ensure the Vite dev server is running (`npm run dev`)
- Use `npm run electron:dev` instead to start both simultaneously
- Check the Electron console for errors (View → Toggle Developer Tools)

### Port Already in Use

```bash
# If port 5173 is busy, kill the process or change the port in vite.config.ts
```

### Build Errors

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👥 Credits

**Developed by**: ProcureDesk Team  
**Version**: 1.0.0  
**Last Updated**: November 2025

---

## 🚧 Roadmap

- [ ] Backend integration (API connectivity)
- [ ] Database integration (SQLite/PostgreSQL)
- [ ] User authentication & authorization
- [ ] Real-time notifications
- [ ] PDF export functionality
- [ ] Excel import/export
- [ ] Multi-language support
- [ ] Automated testing suite
- [ ] Electron app packaging & distribution

---

## 💬 Support

For issues, questions, or contributions, please open an issue or contact the development team.

---

<div align="center">
Made with ❤️ using Electron, React, and TypeScript
</div>
