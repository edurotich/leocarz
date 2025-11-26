import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - LeoCarZ',
  description: 'Privacy policy for LeoCarZ - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-sky-50/30">
      <Header />
      
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-slate-600">Last Updated: November 21, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Welcome to LeoCarZ ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car marketplace platform.
              </p>
              <p className="text-slate-700 leading-relaxed">
                By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies, please do not use our Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 Personal Information You Provide</h3>
                  <p className="text-slate-700 mb-3">We collect information that you voluntarily provide when using our Service:</p>
                  <ul className="space-y-2 text-slate-700 ml-6">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Contact Information:</strong> Name, email address, phone number, physical address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Account Credentials:</strong> Username, password (encrypted)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Vehicle Listings:</strong> Vehicle details, photos, pricing, descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Communication Data:</strong> Messages sent through our platform, customer support inquiries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Payment Information:</strong> If applicable, billing details (processed securely through third-party payment providers)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 Information Automatically Collected</h3>
                  <p className="text-slate-700 mb-3">When you use our Service, we automatically collect certain information:</p>
                  <ul className="space-y-2 text-slate-700 ml-6">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Usage Data:</strong> Pages visited, time spent, search queries, click patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Location Data:</strong> General location information based on IP address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Cookies and Tracking:</strong> See Section 7 for detailed information</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">2.3 Information from Third Parties</h3>
                  <p className="text-slate-700">
                    We may receive information from third-party services when you link your accounts or use social media logins.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">We use your information for the following purposes:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✓ Service Delivery</h4>
                  <p className="text-sm text-slate-700">Operate and maintain our platform, process listings, facilitate connections between buyers and sellers</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✓ Communication</h4>
                  <p className="text-sm text-slate-700">Send notifications, updates, promotional materials, and respond to inquiries</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✓ Personalization</h4>
                  <p className="text-sm text-slate-700">Customize your experience, provide relevant search results and recommendations</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✓ Security & Fraud Prevention</h4>
                  <p className="text-sm text-slate-700">Detect and prevent fraudulent activities, ensure platform security</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✓ Analytics & Improvement</h4>
                  <p className="text-sm text-slate-700">Analyze usage patterns, improve features, conduct research</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✓ Legal Compliance</h4>
                  <p className="text-sm text-slate-700">Comply with Kenyan laws, respond to legal requests, enforce our Terms</p>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How We Share Your Information</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>4.1 Public Information:</strong> Vehicle listings and associated seller information you post are publicly visible on our platform.
                </p>
                <p className="leading-relaxed">
                  <strong>4.2 With Other Users:</strong> Contact information may be shared with potential buyers or sellers when you engage in transactions.
                </p>
                <p className="leading-relaxed">
                  <strong>4.3 Service Providers:</strong> We may share information with third-party service providers who assist in operating our platform (hosting, analytics, payment processing, customer support).
                </p>
                <p className="leading-relaxed">
                  <strong>4.4 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred.
                </p>
                <p className="leading-relaxed">
                  <strong>4.5 Legal Requirements:</strong> We may disclose information when required by law, court order, or to protect our rights and safety.
                </p>
                <p className="leading-relaxed">
                  <strong>4.6 With Your Consent:</strong> We may share your information for other purposes with your explicit consent.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-slate-900 mb-2">🔒 Our Security Commitment</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
              <p className="text-slate-700 mb-3">Our security measures include:</p>
              <ul className="space-y-2 text-slate-700 ml-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Encryption of sensitive data in transit and at rest</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Secure socket layer (SSL) technology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Regular security audits and vulnerability assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Access controls and authentication mechanisms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Employee training on data protection practices</span>
                </li>
              </ul>
              <p className="text-slate-700 mt-4 text-sm italic">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul className="space-y-2 text-slate-700 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Active Accounts:</strong> Information is retained while your account is active</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Inactive Accounts:</strong> Data may be retained for up to 2 years after account deletion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations</span>
                </li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content.
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-slate-900">Essential Cookies</h4>
                  <p className="text-sm text-slate-700">Required for basic site functionality and security</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-slate-900">Analytics Cookies</h4>
                  <p className="text-sm text-slate-700">Help us understand how visitors interact with our site</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-slate-900">Marketing Cookies</h4>
                  <p className="text-sm text-slate-700">Used to deliver relevant advertisements and track ad performance</p>
                </div>
              </div>
              <p className="text-slate-700 mt-4 text-sm">
                You can control cookies through your browser settings. However, disabling cookies may affect site functionality.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Your Privacy Rights</h2>
              <p className="text-slate-700 mb-4">Under Kenyan law and our commitment to privacy, you have the following rights:</p>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">📋 Right to Access</h4>
                  <p className="text-sm text-slate-700">Request copies of your personal information</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">✏️ Right to Correction</h4>
                  <p className="text-sm text-slate-700">Request correction of inaccurate or incomplete information</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">🗑️ Right to Deletion</h4>
                  <p className="text-sm text-slate-700">Request deletion of your personal information (subject to legal requirements)</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">⛔ Right to Object</h4>
                  <p className="text-sm text-slate-700">Object to certain processing of your information</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">📤 Right to Data Portability</h4>
                  <p className="text-sm text-slate-700">Request transfer of your data to another service</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">🚫 Right to Withdraw Consent</h4>
                  <p className="text-sm text-slate-700">Withdraw consent for data processing at any time</p>
                </div>
              </div>
              <p className="text-slate-700 mt-4 text-sm">
                To exercise these rights, please contact us using the information provided in Section 12.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Third-Party Links and Services</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>Note:</strong> Third-party services (like Google Analytics, payment processors, and advertising networks) may collect information according to their own privacy policies.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this Privacy Policy periodically. Continued use of our Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-slate-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
              <p className="text-slate-700 mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <a href="mailto:privacy@leocarz.com" className="text-blue-600 hover:underline">privacy@leocarz.com</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <p className="text-slate-700">+254 725 785 122</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-slate-700">LeoCarZ<br />Eldoret, Kenya</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Acknowledgment</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                By using LeoCarZ, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. If you do not agree with this policy, please discontinue use of our Service immediately.
              </p>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-8">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
