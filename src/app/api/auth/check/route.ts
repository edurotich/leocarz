import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}