# 🎧 AETHER Headphones

> **The New Standard of Pure Sound.** An immersive, scroll-driven 3D product showcase and web experience built for next-generation audio craftsmanship.

---

## 🌟 Overview

**AETHER Headphones** is a premium, interactive web experience showcasing a cutting-edge luxury audio product. Built with **Next.js 16 (App Router)**, **React 19**, **Three.js**, **Framer Motion**, and **Tailwind CSS v4**, the application blends high-performance 3D rendering with fluid micro-interactions, custom shader-like visual effects, dynamic sound feedback, and Firebase authentication.

---

## ✨ Key Features

- **🌀 Scroll-Driven 3D Frame Sequence**: Interactive 3D product explosion and assembly animation tied directly to scroll progress.
- **✨ Interactive Visual Effects**: Custom particle fields (`InteractiveParticles`), liquid image effects (`LiquidImage`), depth parallax (`DepthParallaxImage`), and magnetic hover physics (`Magnetic`).
- **🎵 Spatial Sound Feedback**: Subtle audio interactions integrated into navigation and buttons via custom React hooks (`useSound`).
- **🔐 Firebase Authentication**: Seamless user sign-in/registration flow paired with protected route handlers (`ProtectedRoute`, `AuthContext`).
- **📱 Ultra-Responsive & Performant Layout**: Styled using Tailwind CSS v4 with glassmorphism aesthetics, fluid marquees, dynamic typography, and sticky canvas rendering.
- **🎨 Custom Cursor & Micro-Interactions**: Ambient custom cursor tracking and tilt card dynamics (`TiltCard`, `CustomCursor`) for an ultra-premium feel.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS |
| **3D & Canvas** | [Three.js](https://threejs.org/) • [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) • [@react-three/drei](https://github.com/pmndrs/drei) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend & Auth** | [Firebase Authentication](https://firebase.google.com/) |

---

## 📂 Project Structure

```text
Aether-Headphones/
├── app/
│   ├── globals.css         # Global styles & Tailwind CSS v4 configurations
│   ├── layout.tsx          # Root layout with AuthProvider & CustomCursor
│   ├── page.tsx            # Main landing page with scroll sequence & overlays
│   └── login/              # Authentication page (Sign in / Sign up)
├── components/
│   ├── CustomCursor.tsx    # Interactive ambient cursor follower
│   ├── DepthParallaxImage.tsx # Parallax image visual effects
│   ├── DoodleLayer.tsx     # Overlay graphics and decorative canvas layer
│   ├── Footer.tsx          # Site footer with brand links & dynamic interactive elements
│   ├── InteractiveParticles.tsx # Interactive background particle simulation
│   ├── LiquidImage.tsx     # Liquid displacement effect on product images
│   ├── Magnetic.tsx        # Magnetic hover wrapper component
│   ├── Navbar.tsx          # Scroll-aware dynamic header navigation
│   ├── PageTransition.tsx  # Smooth page transition wrappers
│   ├── ProductSections.tsx # Product feature grids, specifications, & interactive cards
│   ├── ProtectedRoute.tsx  # Authentication route guard wrapper
│   ├── ScrollSequence.tsx  # High-performance 3D canvas scroll animation loader
│   ├── TextOverlay.tsx     # Timed scroll-synced kinetic typography overlays
│   ├── TiltCard.tsx        # 3D card tilt component on mouse move
│   └── useSound.ts         # Web Audio API hook for UI sound effects
├── lib/
│   ├── AuthContext.tsx     # Firebase Auth context state provider
│   ├── firebase.ts        # Firebase app initialization & singleton exported auth
│   └── utils.ts           # Class merging utilities (clsx & tailwind-merge)
├── public/                 # Static assets, audio clips, sequence frames, & brand icons
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher recommended
- **npm** / **yarn** / **pnpm** / **bun**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Aether-Headphones.git
cd Aether-Headphones
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles the application for production deployment.
- `npm run start`: Launches the compiled production server.
- `npm run lint`: Runs ESLint checks across project files.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
