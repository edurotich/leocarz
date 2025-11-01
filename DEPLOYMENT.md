# Deployment Guide

## Environment Variables

Make sure to set these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

## Supabase Setup

1. Create a new project in Supabase
2. Run the SQL from `supabase-schema.sql` in the SQL Editor
3. Enable RLS on the cars table
4. Create a storage bucket named 'car-images' with public access

## Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Local Development

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```