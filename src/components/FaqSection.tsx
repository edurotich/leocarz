'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "How much does it cost to import a car from Japan to Kenya?",
    answer: "The total cost includes the vehicle purchase price, shipping ($800-1500), import duty (25%), VAT (16%), IDF (3.5%), and railway development levy (2%). LeoCarZ handles the entire process including customs clearance and NTSA compliance. Contact us at 0725 785 122 for a detailed quote."
  },
  {
    question: "Do you offer financing for used cars in Eldoret?",
    answer: "Yes! We partner with leading banks and SACCOs to provide affordable car financing. Interest rates start from 12% per annum with flexible terms from 12 to 60 months. Get pre-approved within 24 hours."
  },
  {
    question: "Are your imported cars from Japan inspected?",
    answer: "Every car undergoes: QISJ certification in Japan, comprehensive mechanical inspection in Kenya, NTSA roadworthiness verification, and final quality check in Eldoret. We provide full inspection reports and guarantee quality."
  },
  {
    question: "How long does car importation from Japan take?",
    answer: "The complete process takes 4-6 weeks: auction purchase (1-3 days), QISJ inspection (3-5 days), shipping (21-30 days), customs clearance (5-7 days), and delivery to Eldoret (1-2 days). We keep you updated throughout."
  },
  {
    question: "What makes LeoCarZ the trusted car dealer in Eldoret?",
    answer: "15+ years of experience, 100% transparent pricing, KRA verified and NTSA licensed, comprehensive inspections, dedicated after-sales support, flexible financing, and hundreds of satisfied customers in Eldoret and across Kenya."
  },
  {
    question: "Can you import a specific car model from Japan on my behalf?",
    answer: "Yes! Our car importation on behalf service handles everything: sourcing from Japanese auctions, bidding, payment, shipping, customs clearance, NTSA registration, and delivery to Eldoret. Tell us your preferred model and budget."
  },
  {
    question: "What are your most affordable cars in Eldoret?",
    answer: "We offer affordable cars starting from KES 400,000. Popular options: Toyota Vitz (KES 450K), Nissan March (KES 480K), Mazda Demio (KES 500K), Suzuki Alto (KES 420K), Honda Fit (KES 550K). All thoroughly inspected with warranty options."
  },
  {
    question: "Do you accept trade-ins?",
    answer: "Yes! Bring your current vehicle to our Eldoret showroom for a free valuation. We offer fair market prices and apply the trade-in value toward your new purchase."
  }
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-50/20 py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-600 text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Got Questions?</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-lg">
            Everything you need to know about buying cars in Eldoret and importing from Japan
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-2xl"
              >
                <span className="font-semibold text-slate-900 pr-8 text-base lg:text-lg">
                  {faq.question}
                </span>
                <svg 
                  className={`w-6 h-6 text-sky-600 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="mb-6 text-sky-100">
            Our team in Eldoret is ready to help you find your perfect car
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+254725785122"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-colors duration-300 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call: 0725 785 122
            </a>
            <a 
              href="https://wa.me/254725785122?text=Hi%20LeoCarZ,%20I%20have%20a%20question%20about%20cars%20in%20Eldoret"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
