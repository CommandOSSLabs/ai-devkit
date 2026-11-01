import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skills.commandoss.com"),
  title: {
    default: "AI DevKit — Evolvable agent skills for the full SDLC",
    template: "%s",
  },
  description:
    "Make your coding agent feel right. 23 core cmk:* engineering skills, 6 curated X collections, and MCP support for Claude Code, Codex, and Cursor.",
  openGraph: {
    title: "AI DevKit — Evolvable agent skills for the full SDLC",
    description:
      "Make your coding agent feel right. 23 core cmk:* engineering skills, 6 curated X collections, and MCP support.",
    url: "https://skills.commandoss.com",
    siteName: "AI DevKit",
    type: "website",
    images: [
      {
        url: "https://skills.commandoss.com/og.png",
        width: 2600,
        height: 1658,
        alt: "AI DevKit is a tool for shaping your SDLC by feel.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI DevKit — Evolvable agent skills for the full SDLC",
    description:
      "Make your coding agent feel right. 23 core cmk:* engineering skills, 6 curated X collections, and MCP support.",
    images: [
      {
        url: "https://skills.commandoss.com/og.png",
        alt: "AI DevKit is a tool for shaping your SDLC by feel.",
      },
    ],
  },
};

const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var stored = localStorage.getItem("ai-devkit-theme");
      var theme = stored === "light" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch (e) {
      document.documentElement.classList.add("dark");
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${geist.variable} ${geistMono.variable} font-sans antialiased bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
