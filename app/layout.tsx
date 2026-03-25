import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ergebnisse 2026 – Olympia Portal",
  description: "Offizielles Ergebnisse-Portal der Olympischen Winterspiele 2026",
};

export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="de" suppressHydrationWarning>
          <head>
              {/* Olympia 2026 Design System Fonts (Spec §2) */}
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link
                  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
                  rel="stylesheet"
              />
          </head>
          <body className="font-sans antialiased">
              {children}
          </body>
      </html>
  );
}
