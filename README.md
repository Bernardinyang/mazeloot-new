# Mazeloot Frontend

A modern, responsive web application built with Vue.js 3, Tailwind CSS, Shadcn components, and Pinia.

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework using Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS 3** - Utility-first CSS framework
- **Pinia** - State management for Vue
- **Vue Router** - Official router for Vue.js
- **Radix Vue** - Unstyled, accessible component primitives
- **Shadcn-style components** - Beautiful, reusable UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Vue components
│   ├── ui/         # Shadcn-style UI components
│   └── Navbar.vue  # Navigation component
├── lib/            # Utility functions
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
├── views/          # Page components
├── App.vue         # Root component
└── main.ts         # Application entry point
```

## Features

- ✅ Vue 3 Composition API
- ✅ TypeScript support
- ✅ Responsive design
- ✅ State management with Pinia
- ✅ Client-side routing
- ✅ Modern UI components
- ✅ Dark mode ready (CSS variables configured)

## License

ISC

