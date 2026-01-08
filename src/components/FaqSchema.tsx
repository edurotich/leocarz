'use client'

export default function FaqSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does it cost to import a car from Japan to Kenya?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The total cost of importing a car from Japan to Kenya includes: the vehicle purchase price from auction, shipping costs ($800-1500 USD depending on vehicle size), import duty (25%), VAT (16%), IDF (3.5%), and railway development levy (2%). LeoCarZ handles the entire process including customs clearance and NTSA compliance. Contact us at 0725 785 122 for a detailed quote based on your preferred vehicle model."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer financing for used cars in Eldoret?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! LeoCarZ partners with leading banks and SACCOs in Eldoret and across Kenya to provide affordable car financing options. We offer flexible payment plans with competitive interest rates starting from 12% per annum. Terms range from 12 to 60 months. Contact us to discuss your financing needs and get pre-approved within 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "Are your imported cars from Japan inspected?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Every car we import from Japan undergoes rigorous quality inspection: QISJ (Quality Inspection Services Japan) certification before shipping, comprehensive mechanical inspection upon arrival in Kenya, NTSA roadworthiness verification, and final quality check at our Eldoret showroom. We provide full inspection reports and guarantee the quality of every vehicle. All our locally used cars in Eldoret also undergo thorough multi-point inspections."
        }
      },
      {
        "@type": "Question",
        "name": "How long does car importation from Japan take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The complete car importation process from Japan to Eldoret typically takes 4-6 weeks. This includes: auction purchase and payment (1-3 days), QISJ inspection in Japan (3-5 days), shipping from Japan to Mombasa (21-30 days), customs clearance and NTSA processing (5-7 days), and final delivery to Eldoret (1-2 days). We keep you updated throughout the entire process with regular status reports."
        }
      },
      {
        "@type": "Question",
        "name": "What makes LeoCarZ the trusted car dealer in Eldoret?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LeoCarZ has built a reputation as the most trusted car dealer in Eldoret through: over 15 years of experience in the automotive industry, 100% transparent pricing with no hidden fees, KRA verified and NTSA licensed operations, comprehensive vehicle inspections and warranties, dedicated after-sales support, flexible financing options, and hundreds of satisfied customers. We specialize in both locally used cars in Eldoret and imported cars from Japan to Kenya."
        }
      },
      {
        "@type": "Question",
        "name": "Do you accept trade-ins for used cars in Eldoret?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we accept trade-ins! Bring your current vehicle to our Eldoret showroom for a free valuation. We offer fair market prices and can apply the trade-in value directly toward your purchase of any car from our inventory. This makes upgrading to a better vehicle more affordable for Eldoret residents."
        }
      },
      {
        "@type": "Question",
        "name": "Can you import a specific car model from Japan on my behalf?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer comprehensive car importation on behalf services in Kenya. Simply tell us your preferred make, model, year, and budget, and our team will source the perfect vehicle from trusted Japanese auctions. We handle everything: auction bidding, payment processing, shipping, customs clearance, NTSA registration, and delivery to Eldoret. You only pay once and get complete peace of mind."
        }
      },
      {
        "@type": "Question",
        "name": "What are your most affordable cars in Eldoret?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LeoCarZ offers a wide range of affordable cars in Eldoret starting from KES 400,000. Popular budget-friendly options include: Toyota Vitz (from KES 450,000), Nissan March (from KES 480,000), Mazda Demio (from KES 500,000), Suzuki Alto (from KES 420,000), and Honda Fit (from KES 550,000). All our affordable cars are thoroughly inspected, reliable, and come with warranty options. Visit our showroom or browse our online inventory to find the perfect car within your budget."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}
