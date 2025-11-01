# Car Yard Website - Next.js 14 + Supabase

## Project Overview
A car selling and yard tracking website built with Next.js 14, Supabase, and Tailwind CSS. Features include car listings, admin dashboard, image management, and responsive design.

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Key Features
- Car CRUD operations (Add, Edit, Delete, Hide/Show, Mark Sold)
- Image upload and management
- Search and filtering
- Admin dashboard
- Mobile-responsive design
- No authentication required

## Development Guidelines
- Use App Router for all pages
- Implement TypeScript strictly
- Follow mobile-first responsive design
- Use Supabase client for all database operations
- Store images in Supabase Storage
- Keep UI clean and modern

## Database Schema
Cars table with: id, make, model, year, mileage, price, condition, color, transmission, fuel_type, description, location, images[], status, is_hidden, created_at