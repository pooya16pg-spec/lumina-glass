import type { Metadata, Viewport } from "next";
// @ts-ignore
import "./globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0B1021" };

export const metadata: Metadata = {
  title: "LuminaGlass | Pooya Goodarzi — Liquid Glass Spatial AI & Audio Studio",
  description:
    "Responsive Liquid Glass optical studio, browser-native audio EQ and engineering portfolio by Pooya Goodarzi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Vazirmatn:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{children}</body>
    </html>
  );
}