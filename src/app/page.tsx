import { Suspense } from 'react';
import Header from '@/components/Header';
import CarGrid from '@/components/CarGrid';
import SearchFilters from '@/components/SearchFilters';
import FaqSection from '@/components/FaqSection';
import FaqSchema from '@/components/FaqSchema';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-sky-50/30">
      <FaqSchema />
      <Header />
      
      {/* Premium Hero Section with Modern Glassmorphism */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/95 to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400/30 rounded-full filter blur-3xl animate-float"></div>
            <div className="absolute top-40 right-32 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/25 rounded-full filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          </div>
          
          {/* Enhanced Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' /%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Compact Trust Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-sm font-semibold mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Kenya's #1 Trusted Car Marketplace
              <div className="ml-2 px-2 py-0.5 bg-emerald-400/80 text-emerald-900 rounded-md text-xs font-bold">VERIFIED</div>
            </div>
            
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                Trusted Car Dealer in
                <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent ml-3">
                  Eldoret
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-300/90 max-w-2xl mx-auto mb-8 leading-relaxed">
                Used cars for sale in Eldoret • Imported cars from Japan to Kenya • Car importation on behalf • Affordable locally used cars
              </p>
              
              {/* Compact CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <a 
                  href="#featured-cars"
                  className="group relative px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explore Cars
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>
                
                <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Help
                  <span className="ml-1 px-1.5 py-0.5 bg-green-400/80 text-green-900 rounded-full text-xs font-bold">24/7</span>
                </button>
              </div>
              
              {/* Compact Horizontal Stats */}
              <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8">
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-2xl font-black text-white">500+</div>
                  <div className="text-slate-300 text-xs font-medium">Premium Cars</div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-2xl font-black text-white">15+</div>
                  <div className="text-slate-300 text-xs font-medium">Years Trusted</div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-2xl font-black text-white">47</div>
                  <div className="text-slate-300 text-xs font-medium">Counties Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elegant Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-slate-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </section>

      {/* Enhanced Main Content */}
      <main className="container mx-auto px-4 py-8 lg:px-8">
        {/* Premium Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
          <div className="text-sm font-semibold text-slate-600 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted & Certified
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-md border border-slate-100">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-800">KRA Verified</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-md border border-slate-100">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-800">NTSA Licensed</span>
            </div>
            

          </div>
        </div>

        {/* Compact Search Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Find Your 
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"> Perfect Match</span>
            </h2>
          </div>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Discover premium vehicles with our intelligent search system
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 animate-pulse border border-slate-200/50">
            <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        }>
          <div className="mb-8">
            <SearchFilters />
          </div>
        </Suspense>



        {/* Featured Cars Section */}
        <section id="featured-cars">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Latest Arrivals</h3>
              <p className="text-slate-600 text-lg">Fresh inventory • Best deals • Premium selection</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Updated hourly</span>
              </div>
              
              <a 
                href="#featured-cars"
                className="group bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-2xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>View All Cars</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          <Suspense fallback={
            <div className="car-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-pulse border border-slate-100">
                  <div className="aspect-4-3 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-sky-200 to-blue-200 rounded-lg w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <CarGrid />
          </Suspense>
        </section>

        {/* Compact Value Props */}
        <section className="mt-12 py-8 bg-slate-50 rounded-2xl">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  🔍
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Quality Assured</h4>
                <p className="text-slate-600 text-sm">Inspected & certified vehicles</p>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center text-xl text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  �
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Fair Pricing</h4>
                <p className="text-slate-600 text-sm">Transparent, no hidden costs</p>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  🚚
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Nationwide Delivery</h4>
                <p className="text-slate-600 text-sm">Free to all 47 counties</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Call-to-Action Section */}
        <section className="mt-24 py-20 bg-gradient-to-br from-slate-900 via-blue-900/95 to-indigo-900 rounded-3xl relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-20 w-40 h-40 bg-sky-400/20 rounded-full filter blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-56 h-56 bg-blue-400/15 rounded-full filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-400/20 rounded-full filter blur-2xl animate-bounce-gentle"></div>
          </div>
          
          <div className="relative container mx-auto px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sky-200 text-sm font-semibold mb-8">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <span>Ready to Find Your Car?</span>
              </div>
              
              <h3 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Start Your
                <span className="block bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-gradient">
                  Car Journey Today
                </span>
              </h3>
              
              <p className="text-xl lg:text-2xl text-slate-300/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who found their perfect vehicle through our trusted platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a 
                  href="#featured-cars"
                  className="group relative px-10 py-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse All Cars
                    <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>
                
                <button className="group px-10 py-5 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Get Expert Help
                  <div className="ml-3 px-3 py-1 bg-emerald-400/90 text-emerald-900 rounded-full text-sm font-bold">FREE</div>
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-slate-300 text-sm">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">0%</div>
                  <div className="text-slate-300 text-sm">Hidden Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">100%</div>
                  <div className="text-slate-300 text-sm">Satisfaction Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SEO Content Section */}
      <section className="bg-white py-16 mt-16 border-t border-slate-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Your Trusted Car Dealer in Eldoret, Kenya
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Used Cars for Sale in Eldoret</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Looking for <strong>used cars for sale in Eldoret</strong>? LeoCarZ offers an extensive selection of 
                quality pre-owned vehicles. As a <strong>trusted car dealer in Eldoret</strong>, we provide transparent 
                pricing and comprehensive vehicle inspections on all our <strong>locally used cars in Eldoret</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our inventory includes <strong>affordable cars in Eldoret</strong> across all makes and models. From 
                compact sedans to spacious SUVs, find your perfect match at competitive prices.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Imported Cars from Japan to Kenya</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Specializing in <strong>imported cars from Japan to Kenya</strong>, LeoCarZ brings you premium Japanese 
                vehicles at unbeatable prices. We handle complete <strong>car importation on behalf in Kenya</strong>, 
                managing every step from auction purchase to delivery in Eldoret.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our import service covers all documentation, shipping, customs clearance, and compliance. Trust our 
                expertise in Japanese car imports to get you the best value for your investment.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50 p-8 lg:p-12 rounded-2xl shadow-xl border border-sky-100">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 text-center">
              Why Choose LeoCarZ as Your Car Dealer in Eldoret?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Verified Quality</h4>
                <p className="text-sm text-slate-600">
                  Every vehicle undergoes rigorous inspection to ensure quality and reliability
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Transparent Pricing</h4>
                <p className="text-sm text-slate-600">
                  No hidden fees. Clear, competitive pricing on all our vehicles
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Full Service Support</h4>
                <p className="text-sm text-slate-600">
                  From import to ownership transfer, we handle everything for you
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto">
              As the leading <strong>car dealer Eldoret</strong> residents trust, LeoCarZ has built a reputation for 
              excellence in both local and import car sales. Whether you're looking for <strong>affordable cars in Eldoret</strong> 
              or premium <strong>imported cars from Japan to Kenya</strong>, our team is dedicated to helping you find the 
              perfect vehicle. Contact us today to explore our extensive inventory of <strong>locally used cars in Eldoret</strong> 
              or inquire about our <strong>car importation on behalf in Kenya</strong> service.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
      
      {/* Premium Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 mt-0 overflow-hidden border-t border-slate-700/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 lg:px-8">
          {/* Enhanced Newsletter Section */}
          <div className="text-center mb-20 pb-20 border-b border-slate-700/50">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Stay Connected</span>
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">Never Miss a Deal</h3>
            <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Get exclusive access to premium vehicles, special pricing, and expert car-buying tips delivered straight to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full px-6 py-4 bg-slate-800/60 backdrop-blur-sm border-2 border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center">
                <span>Subscribe Free</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-slate-500">
              Join 50,000+ car enthusiasts • Unsubscribe anytime • No spam, ever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/images/logo.svg" 
                  alt="Leo Cars Logo" 
                  className="h-12 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
                Your trusted partner in finding the perfect vehicle in Kenya. We connect you with quality cars from verified dealers across all 47 counties.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
                  { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                  { name: 'Instagram', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.61-3.197-1.559C4.61 14.831 4.61 13.681 5.252 12.934c.642-.747 1.792-1.186 3.197-1.186s2.555.439 3.197 1.186c.642.747.642 1.897 0 2.645-.749.949-1.9 1.409-3.197 1.409zm7.138 0c-1.297 0-2.448-.61-3.197-1.559-.642-.748-.642-1.898 0-2.645.749-.747 1.9-1.186 3.197-1.186s2.448.439 3.197 1.186c.642.747.642 1.897 0 2.645-.749.949-1.9 1.409-3.197 1.409z' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-sky-600 hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: '🚗 Browse Cars', href: '/' },
                  { name: '💰 Sell Your Car', href: '/admin' },
                  { name: '🏦 Financing Options', href: '#' },
                  { name: '🛡️ Insurance Partners', href: '#' },
                  { name: '🔧 Service Centers', href: '#' }
                ].map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                {[
                  { name: '📞 24/7 Help Center', href: '#' },
                  { name: '💬 Live Chat Support', href: '#' },
                  { name: '📍 Find Locations', href: '#' },
                  { name: '📋 Terms of Service', href: '#' },
                  { name: '🔒 Privacy Policy', href: '#' }
                ].map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-slate-400 hover:text-white transition-colors duration-300">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="space-y-2 text-sm">
                  <p className="text-slate-400">📞 +254 725 785 122</p>
                  <p className="text-slate-400">✉️ info@leocarz.com</p>
                  <p className="text-slate-400">📍 Eldoret, Kenya</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              &copy; 2025 Leo Cars Kenya. All rights reserved. | Built with ❤️ in Kenya
            </p>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                All systems operational
              </span>
              <span>KES Currency</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}