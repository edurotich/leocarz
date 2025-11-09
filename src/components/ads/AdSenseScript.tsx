'use client'

import Script from 'next/script'

export default function AdSenseScript() {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6333059555540167"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script id="adsense-init" strategy="afterInteractive">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-6333059555540167",
            enable_page_level_ads: true
          });
        `}
      </Script>
    </>
  )
}