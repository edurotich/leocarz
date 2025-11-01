import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car Yard - Quality Cars for Sale",
  description: "Find your perfect car at our car yard. Browse through our collection of quality vehicles.",
  keywords: ["cars", "car sales", "used cars", "car yard", "vehicles"],
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
      </body>
    </html>
  );
}