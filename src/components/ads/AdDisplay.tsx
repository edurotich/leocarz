'use client'

interface AdDisplayProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle'
  layout?: 'in-article' | 'display'
  style?: React.CSSProperties
}

export default function AdDisplay({ slot, format = 'auto', layout = 'display', style }: AdDisplayProps) {
  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="YOUR-ADSENSE-CLIENT-ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </div>
  )
}