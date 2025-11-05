import type { Metadata } from "next";
import "./globals.css";
import GetHelpButton from '@/components/GetHelpButton';

export const metadata: Metadata = {
  title: "leocarz - Quality Cars for Sale",
  description: "Find your perfect car at leocarz. Browse through our collection of quality vehicles.",
  keywords: ["cars", "car sales", "used cars", "leocarz", "vehicles"],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <GetHelpButton />
      </body>
    </html>
  );
}