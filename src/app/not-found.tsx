import Link from 'next/link';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Cars
            </Link>
            
            <div className="text-center">
              <Link 
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Go to Admin Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}