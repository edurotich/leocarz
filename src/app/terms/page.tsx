import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - LeoCarZ',
  description: 'Terms and conditions for using LeoCarZ car marketplace platform in Kenya.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-sky-50/30">
      <Header />
      
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-slate-600">Last Updated: November 21, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Welcome to LeoCarZ ("Company", "we", "our", "us"). These Terms of Service ("Terms") govern your use of our website located at leocarz.com and our car marketplace services in Kenya.
              </p>
              <p className="text-slate-700 leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Definitions</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span><strong>"Service"</strong> refers to the LeoCarZ website and car marketplace platform.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span><strong>"User"</strong> means any individual or entity that accesses or uses our Service.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span><strong>"Seller"</strong> refers to users listing vehicles for sale on our platform.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span><strong>"Buyer"</strong> refers to users searching for or purchasing vehicles through our platform.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span><strong>"Listing"</strong> means any vehicle advertisement posted on LeoCarZ.</span>
                </li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts and Registration</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>3.1 Account Creation:</strong> To list vehicles or access certain features, you may need to create an account. You must provide accurate, current, and complete information.
                </p>
                <p className="leading-relaxed">
                  <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                </p>
                <p className="leading-relaxed">
                  <strong>3.3 Eligibility:</strong> You must be at least 18 years old and legally capable of entering into binding contracts under Kenyan law to use our Service.
                </p>
              </div>
            </section>

            {/* Vehicle Listings */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Vehicle Listings and Sales</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>4.1 Listing Requirements:</strong> Sellers must provide accurate, truthful, and complete information about vehicles, including condition, mileage, service history, and any known defects.
                </p>
                <p className="leading-relaxed">
                  <strong>4.2 Prohibited Content:</strong> Listings must not contain false, misleading, or deceptive information. Stolen vehicles, vehicles with tampered odometers, or illegally imported vehicles are strictly prohibited.
                </p>
                <p className="leading-relaxed">
                  <strong>4.3 Pricing:</strong> All prices must be clearly stated in Kenyan Shillings (KSh). Hidden fees or misleading pricing practices are not allowed.
                </p>
                <p className="leading-relaxed">
                  <strong>4.4 LeoCarZ Role:</strong> We act as a marketplace platform connecting buyers and sellers. We are not a party to any transaction and do not own, sell, or take possession of any vehicles listed.
                </p>
                <p className="leading-relaxed">
                  <strong>4.5 Verification:</strong> While we strive to verify listings, users are responsible for conducting their own due diligence, including vehicle inspections and verification of ownership documents.
                </p>
              </div>
            </section>

            {/* Transactions */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Transactions and Payments</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>5.1 Direct Transactions:</strong> All sales transactions occur directly between buyers and sellers. LeoCarZ does not handle payments or facilitate financial transactions.
                </p>
                <p className="leading-relaxed">
                  <strong>5.2 Payment Methods:</strong> Buyers and sellers are free to agree on payment methods. We recommend secure payment methods and caution against cash transactions for high-value purchases.
                </p>
                <p className="leading-relaxed">
                  <strong>5.3 Taxes and Fees:</strong> Users are responsible for all applicable taxes, transfer fees, and registration costs as required by Kenyan law.
                </p>
              </div>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. User Conduct and Prohibited Activities</h2>
              <p className="text-slate-700 leading-relaxed mb-4">Users agree not to:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Post false, misleading, or fraudulent listings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Engage in price manipulation or bid rigging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Harass, threaten, or defraud other users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>List stolen vehicles or vehicles with disputed ownership</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Violate Kenyan laws, including NTSA and KRA regulations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Use automated systems or bots to access the Service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Interfere with or disrupt the Service's functionality</span>
                </li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property Rights</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>7.1 Platform Content:</strong> The Service and its original content, features, and functionality are owned by LeoCarZ and are protected by Kenyan and international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="leading-relaxed">
                  <strong>7.2 User Content:</strong> By posting content (photos, descriptions, etc.), you grant LeoCarZ a non-exclusive, royalty-free license to use, display, and distribute that content on our platform.
                </p>
                <p className="leading-relaxed">
                  <strong>7.3 User Responsibility:</strong> You represent that you own or have necessary rights to all content you post and that it doesn't infringe on third-party rights.
                </p>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Disclaimers and Limitation of Liability</h2>
              <div className="space-y-4 text-slate-700">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-semibold mb-2">IMPORTANT DISCLAIMER:</p>
                  <p className="text-sm leading-relaxed">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. LEOCARZ MAKES NO GUARANTEES ABOUT THE ACCURACY OF LISTINGS, VEHICLE CONDITIONS, OR SELLER REPRESENTATIONS.
                  </p>
                </div>
                <p className="leading-relaxed">
                  <strong>8.1 Vehicle Condition:</strong> We do not inspect vehicles and cannot guarantee their condition, history, or legal status. Buyers must conduct their own inspections and due diligence.
                </p>
                <p className="leading-relaxed">
                  <strong>8.2 User Disputes:</strong> LeoCarZ is not liable for disputes between buyers and sellers, including but not limited to vehicle defects, payment issues, or misrepresentations.
                </p>
                <p className="leading-relaxed">
                  <strong>8.3 Limitation of Liability:</strong> To the maximum extent permitted by Kenyan law, LeoCarZ shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Indemnification</h2>
              <p className="text-slate-700 leading-relaxed">
                You agree to indemnify and hold harmless LeoCarZ, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, your listings, your transactions, or your violation of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Termination</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  We reserve the right to suspend or terminate your account and access to the Service immediately, without prior notice, for any violation of these Terms or for any other reason at our sole discretion.
                </p>
                <p className="leading-relaxed">
                  Upon termination, your right to use the Service will immediately cease. All provisions that should reasonably survive termination shall remain in effect.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law and Dispute Resolution</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>11.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya.
                </p>
                <p className="leading-relaxed">
                  <strong>11.2 Jurisdiction:</strong> Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of Kenya.
                </p>
                <p className="leading-relaxed">
                  <strong>11.3 Dispute Resolution:</strong> We encourage users to first attempt to resolve disputes through direct negotiation. If unsuccessful, parties may pursue mediation before legal action.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page with a new "Last Updated" date. Your continued use of the Service after changes constitute acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-slate-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
              <p className="text-slate-700 mb-4">If you have questions about these Terms, please contact us:</p>
              <div className="space-y-2 text-slate-700">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <strong>Email:</strong> <a href="mailto:legal@leocarz.com" className="text-blue-600 hover:underline ml-2">legal@leocarz.com</a>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <strong>Phone:</strong> <span className="ml-2">+254 725 785 122</span>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <strong>Address:</strong> <span className="ml-2">Eldoret, Kenya</span>
                </p>
              </div>
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
