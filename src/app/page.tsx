import { Suspense } from 'react';
import Header from '@/components/Header';
import CarGrid from '@/components/CarGrid';
import SearchFilters from '@/components/SearchFilters';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Your 
                <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}Perfect Car
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover quality vehicles from trusted dealers across Kenya. Transparent pricing, exceptional service, and nationwide delivery.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">300+</div>
                  <div className="text-slate-300 text-sm">Quality Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">15+</div>
                  <div className="text-slate-300 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">47</div>
                  <div className="text-slate-300 text-sm">Counties Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-slate-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-12 lg:px-8">
        <Suspense fallback={
          <div className="card p-6 mb-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        }>
          <SearchFilters />
        </Suspense>

        <Suspense fallback={
          <div className="car-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-4-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded-lg w-1/2"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <CarGrid />
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-20">
        <div className="container mx-auto px-4 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/images/logo.svg" 
                  alt="LoeCarZ Logo" 
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-slate-400 max-w-md">
                Your trusted partner in finding the perfect vehicle in Kenya. We connect you with quality cars from verified dealers across all counties.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Browse Cars</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Sell Your Car</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 LoeCarZ Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}