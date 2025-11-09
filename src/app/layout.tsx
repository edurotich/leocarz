import type { Metadata } from "next";
import "./globals.css";
import GetHelpButton from '@/components/GetHelpButton';
import JsonLd from '@/components/JsonLd';
import { Analytics } from '@vercel/analytics/react';
import AdSenseScript from '@/components/ads/AdSenseScript';

export const metadata: Metadata = {
  title: "LeoCarZ - Premium Cars for Sale in Eldoret, Kenya",
  description: "Find your perfect car at LeoCarZ. Browse our premium collection of quality vehicles in Eldoret, Kenya. New & used cars with verified dealers, transparent pricing, and exceptional customer service.",
  keywords: ["cars for sale", "used cars Kenya", "new cars Eldoret", "car dealership Kenya", "LeoCarZ", "premium vehicles", "car sales Eldoret", "verified car dealers", "quality used cars", "car marketplace Kenya"],
  authors: [{ name: "LeoCarZ" }],
  creator: "LeoCarZ",
  publisher: "LeoCarZ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-site-verification-here',
  },
  alternates: {
    canonical: 'https://leocarz.com',
  },
  openGraph: {
    title: 'LeoCarZ - Premium Cars for Sale in Eldoret, Kenya',
    description: 'Find your perfect car at LeoCarZ. Browse our premium collection of quality vehicles in Eldoret, Kenya. New & used cars with verified dealers.',
    url: 'https://leocarz.com',
    siteName: 'LeoCarZ',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        url: 'https://leocarz.com/images/og-image.jpg', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'LeoCarZ - Premium Cars Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeoCarZ - Premium Cars for Sale in Eldoret, Kenya',
    description: 'Find your perfect car at LeoCarZ. Browse our premium collection of quality vehicles in Eldoret, Kenya.',
    images: ['https://leocarz.com/images/twitter-image.jpg'], // You'll need to create this
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6333059555540167" />
      </head>
      <body className="antialiased">
        <JsonLd />
        <AdSenseScript />
        {children}
        <GetHelpButton />
        <Analytics />
      </body>
    </html>
  );
}