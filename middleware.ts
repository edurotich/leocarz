import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin route detected:', request.nextUrl.pathname)
    
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    console.log('Is authenticated:', isAuthenticated)
    console.log('Cookies:', request.cookies.getAll())
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !request.nextUrl.pathname.endsWith('/login')) {
      console.log('Redirecting to login page')
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // If authenticated and on login page, redirect to admin dashboard
    if (isAuthenticated && request.nextUrl.pathname.endsWith('/login')) {
      console.log('Redirecting to admin dashboard')
      const adminUrl = new URL('/admin', request.url)
      return NextResponse.redirect(adminUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}