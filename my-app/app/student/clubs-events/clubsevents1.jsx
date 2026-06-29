import { Inter, Sora } from "next/font/google";
import "./globals.css";
import ClubsEventsHub from "@/components/ClubsEventsHub";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

// ❌ REMOVE metadata typing
export const metadata = {
  title: "EduSphere AI | Clubs & Events Hub",
  description:
    "Elevate your campus experience through intelligence and community.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-background text-on-surface antialiased">
        <ClubsEventsHub />
        {children}
      </body>
    </html>
  );
}

// src/app/globals.css - Global Styles

//     @tailwind base;
// @tailwind components;
// @tailwind utilities;

// /* Custom Variables */
// :root {
//     --font - inter: Inter;
//     --font - sora: Sora;
// }

// /* Glass Panel Component */
// .glass - panel {
//     @apply bg - white / 70 backdrop - blur - 12px border border - secondary / 20 rounded - xl transition - all duration - 200;
// }

// .glass - panel:hover {
//     @apply shadow - md bg - white / 80;
// }

// /* Typography Defaults */
// body {
//     @apply font - body - md;
//     font - feature - settings: "rlig" 1, "calt" 1;
// }

// h1,
//     h2,
//     h3,
//     h4,
//     h5,
//     h6 {
//     @apply font - headline - sm font - bold;
// }

// h1 {
//     @apply text - headline - xl;
// }

// h2 {
//     @apply text - headline - lg;
// }

// h3 {
//     @apply text - headline - md;
// }

// /* Link Styles */
// a {
//     @apply transition - colors duration - 200;
// }

// a:hover {
//     @apply text - secondary;
// }

// /* Button Reset */
// button {
//     @apply font - label - md;
// }

// /* Scrollbar Styling */
// :: -webkit - scrollbar {
//     width: 8px;
//     height: 8px;
// }

// :: -webkit - scrollbar - track {
//     background: transparent;
// }

// :: -webkit - scrollbar - thumb {
//     background: rgba(0, 32, 69, 0.2);
//     border - radius: 4px;
//     transition: background 0.2s;
// }

// :: -webkit - scrollbar - thumb:hover {
//     background: rgba(0, 32, 69, 0.4);
// }

// /* Firefox Scrollbar */
// * {
//     scrollbar- color: rgba(0, 32, 69, 0.2) transparent;
// scrollbar - width: thin;
// }

// /* Focus Visible for Accessibility */
// button: focus - visible,
//     a: focus - visible,
//         input: focus - visible {
//     @apply outline - none ring - 2 ring - secondary ring - offset - 2;
// }

// /* Input Styling */
// input {
//     @apply bg - surface - container text - on - surface placeholder - on - surface - variant;
//     @apply focus: ring - 2 focus: ring - secondary focus: bg - surface - container - low transition - all;
// }

// input::placeholder {
//     @apply text - on - surface - variant;
// }

// /* Smooth Scrolling */
// html {
//     scroll - behavior: smooth;
// }

// /* Selection Color */
// ::selection {
//     @apply bg - secondary text - on - secondary;
// }

// /* Mobile Menu Animation */
// @media(max - width: 1024px) {
// aside {
//         transition: transform 0.3s cubic - bezier(0.4, 0, 0.2, 1);
//     }
// }

// /* Animations */
// @keyframes fadeIn {
// from {
//         opacity: 0;
//     }
// to {
//         opacity: 1;
//     }
// }

// @keyframes slideInUp {
// from {
//         transform: translateY(20px);
//         opacity: 0;
//     }
// to {
//         transform: translateY(0);
//         opacity: 1;
//     }
// }

// .animate - fade -in {
//     animation: fadeIn 0.3s ease-in -out;
// }

// .animate - slide -in {
//     animation: slideInUp 0.3s ease-in -out;
// }

// ---

// // package.json - Dependencies Configuration

// {
//     "name": "edusphere-ai",
//     "version": "1.0.0",
//     "private": true,
//     "scripts": {
//         "dev": "next dev",
//         "build": "next build",
//         "start": "next start",
//         "lint": "next lint",
//         "type-check": "tsc --noEmit"
//     },
//     "dependencies": {
//         "next": "^14.0.0",
//         "react": "^18.2.0",
//         "react-dom": "^18.2.0",
//         "lucide-react": "^0.294.0"
//     },
//     "devDependencies": {
//         "typescript": "^5.3.0",
//         "@types/node": "^20.10.0",
//         "@types/react": "^18.2.0",
//         "@types/react-dom": "^18.2.0",
//         "tailwindcss": "^3.4.0",
//         "@tailwindcss/forms": "^0.5.7",
//         "postcss": "^8.4.32",
//         "autoprefixer": "^10.4.16"
//     }
// }

