import type { Metadata } from "next";
import "./globals.css";
import GetHelpButton from '@/components/GetHelpButton';
import JsonLd from '@/components/JsonLd';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "LeoCarZ - Trusted Car Dealer in Eldoret | Used Cars for Sale Kenya",
  description: "Top trusted car dealer in Eldoret. Specializing in used cars for sale in Eldoret, imported cars from Japan to Kenya, and car importation on behalf. Affordable, locally used cars in Eldoret with transparent pricing. Your #1 car dealer Eldoret.",
  keywords: [
    "car dealer Eldoret",
    "used cars for sale in Eldoret",
    "imported cars from Japan to Kenya",
    "car importation on behalf in Kenya",
    "locally used cars in Eldoret",
    "affordable cars in Eldoret",
    "trusted car dealer in Eldoret",
    "cars for sale Eldoret",
    "Japanese cars Kenya",
    "car dealers in Eldoret Kenya",
    "buy cars in Eldoret",
    "second hand cars Eldoret",
    "car sales Eldoret",
    "import cars from Japan Kenya",
    "cheap cars in Eldoret",
    "LeoCarZ Eldoret",
    "car importers Kenya",
    "quality used cars Eldoret"
  ],
  authors: [{ name: "LeoCarZ" }],
  creator: "LeoCarZ",
  publisher: "LeoCarZ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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
    title: 'LeoCarZ - Trusted Car Dealer Eldoret | Imported Cars from Japan',
    description: 'Leading car dealer in Eldoret. Used cars for sale, imported cars from Japan to Kenya, car importation on behalf. Affordable & locally used cars in Eldoret.',
    url: 'https://leocarz.com',
    siteName: 'LeoCarZ - Trusted Car Dealer Eldoret',
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
    title: 'LeoCarZ - Trusted Car Dealer Eldoret | Imported Japanese Cars',
    description: 'Trusted car dealer in Eldoret. Used cars for sale, imported cars from Japan to Kenya. Affordable locally used cars in Eldoret.',
    images: ['https://leocarz.com/images/twitter-image.jpg'], // You'll need to create this
  },
  metadataBase: new URL('https://leocarz.com'),
  category: 'Automotive',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-6333059555540167" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6333059555540167" crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased">
        <JsonLd />
        {children}
        <GetHelpButton />
        <Analytics />
      </body>
    </html>
  );
}