# Car Yard Website

A modern, responsive car selling and yard management website built with Next.js 14, Supabase, and Tailwind CSS.

## 🚀 Features

- **Car Management**: Add, edit, delete, hide/show, and mark cars as sold
- **Image Upload**: Upload up to 6 images per car using Supabase Storage
- **Search & Filter**: Search by make, model, price range, and status
- **Responsive Design**: Mobile-first design that works on all devices
- **Admin Dashboard**: Simple admin interface for inventory management
- **No Authentication**: Easy to use without login requirements
- **SEO Optimized**: Dynamic meta tags for car listings

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for car images)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier is sufficient)

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd car-yard-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new Supabase project at [supabase.com](https://supabase.com)
   
   b. Copy your project URL and anon key from Settings → API
   
   c. Run the SQL script in `supabase-schema.sql` in your Supabase SQL Editor

4. **Configure environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The database schema is automatically created when you run the SQL script from `supabase-schema.sql`. This creates:

- `cars` table with all necessary fields
- Row Level Security (RLS) policies
- `car-images` storage bucket with public access policies

### Database Schema

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| make | TEXT | Car manufacturer |
| model | TEXT | Car model |
| year | INTEGER | Manufacturing year |
| mileage | INTEGER | Odometer reading (optional) |
| price | NUMERIC | Selling price |
| condition | TEXT | Car condition (New, Used, etc.) |
| color | TEXT | Car color (optional) |
| transmission | TEXT | Transmission type (optional) |
| fuel_type | TEXT | Fuel type (optional) |
| description | TEXT | Detailed description (optional) |
| location | TEXT | Car location (optional) |
| images | TEXT[] | Array of image URLs |
| status | TEXT | 'available' or 'sold' |
| is_hidden | BOOLEAN | Whether car is hidden from public |
| created_at | TIMESTAMPTZ | Creation timestamp |

## 📱 Usage

### Public Features

1. **Browse Cars**: Visit the homepage to see all available cars
2. **Search & Filter**: Use the search bar and filters to find specific cars
3. **View Details**: Click on any car to see full details and image gallery

### Admin Features

1. **Access Admin**: Visit `/admin` (no login required)
2. **Add Cars**: Click "Add New Car" to create new listings
3. **Edit Cars**: Click "Edit" on any car to modify details
4. **Manage Status**: Mark cars as sold/available or hide/show them
5. **Delete Cars**: Permanently remove cars from inventory

### Image Management

- Upload up to 6 images per car
- Images are automatically stored in Supabase Storage
- Supported formats: JPG, PNG, WebP
- Automatic image optimization via Next.js

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

Make sure to add these environment variables in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Customization

### Styling

The website uses Tailwind CSS. You can customize:

- Colors: Edit the color palette in `tailwind.config.ts`
- Layout: Modify components in `src/components/`
- Typography: Update font settings in `src/app/globals.css`

### Features

- **Add Authentication**: Integrate Supabase Auth for admin protection
- **Payment Integration**: Add Stripe or other payment processors
- **Email Notifications**: Set up email alerts for inquiries
- **Advanced Filters**: Add more filtering options (engine size, etc.)
- **Analytics**: Integrate Google Analytics or similar

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── cars/[id]/         # Dynamic car details pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── CarCard.tsx       # Car listing card
│   ├── CarDetails.tsx    # Car detail view
│   ├── CarGrid.tsx       # Car grid layout
│   ├── Header.tsx        # Site header
│   └── SearchFilters.tsx # Search and filter UI
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client and helpers
│   └── placeholder.ts    # Placeholder utilities
└── types/                # TypeScript type definitions
    └── database.ts       # Database type definitions
```

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**
   - Check Supabase Storage bucket permissions
   - Verify image URLs in database
   - Ensure `next.config.js` has correct image domains

2. **Database connection errors**
   - Verify Supabase URL and API key
   - Check environment variable names
   - Ensure RLS policies are set up correctly

3. **Build errors**
   - Run `npm run lint` to check for code issues
   - Verify all imports are correct
   - Check TypeScript errors with `npx tsc --noEmit`

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit [Supabase documentation](https://supabase.com/docs)
- Create an issue in this repository

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy selling! 🚗💨**

---
*Last updated: November 2025 - Admin form enhanced with smart dropdowns*