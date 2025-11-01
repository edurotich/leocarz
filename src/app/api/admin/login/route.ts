import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      // Create response with success
      const response = NextResponse.json(
        { message: 'Login successful' },
        { status: 200 }
      );

      // Set authentication cookie
      response.cookies.set('admin-authenticated', 'true', {
        httpOnly: false, // Allow client-side access for middleware
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}