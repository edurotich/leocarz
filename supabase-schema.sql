-- Drop existing policies and table if they exist (for clean setup)
DROP POLICY IF EXISTS "Public cars are viewable by everyone" ON cars;
DROP POLICY IF EXISTS "Allow all operations for admin" ON cars;
DROP TABLE IF EXISTS cars CASCADE;

-- Create the cars table
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  price NUMERIC NOT NULL,
  condition TEXT NOT NULL,
  color TEXT,
  transmission TEXT,
  fuel_type TEXT,
  description TEXT,
  location TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create simple policy to allow all operations (no auth required)
CREATE POLICY "Allow all operations" ON cars FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data (prices in Kenya Shillings)
INSERT INTO cars (make, model, year, mileage, price, condition, color, transmission, fuel_type, description, location, status, is_hidden) VALUES
('Toyota', 'Camry', 2020, 45000, 3200000, 'Good', 'Silver', 'Automatic', 'Petrol', 'Well-maintained Toyota Camry with low mileage. Great for daily commuting.', 'Nairobi Showroom', 'available', false),
('Honda', 'Civic', 2019, 32000, 2800000, 'Excellent', 'Blue', 'Manual', 'Petrol', 'Sporty Honda Civic in excellent condition. Perfect for city driving.', 'Mombasa Branch', 'available', false),
('Ford', 'F-150', 2021, 28000, 4500000, 'Like New', 'Black', 'Automatic', 'Petrol', 'Powerful pickup truck, perfect for work and adventure.', 'Kisumu Location', 'sold', false),
('Nissan', 'X-Trail', 2020, 38000, 3500000, 'Good', 'White', 'Automatic', 'Petrol', 'Reliable family SUV with excellent fuel economy and safety features.', 'Nakuru Branch', 'available', false),
('Subaru', 'Forester', 2019, 42000, 3100000, 'Excellent', 'Grey', 'Automatic', 'Petrol', 'All-wheel drive SUV perfect for Kenyan roads and weather conditions.', 'Eldoret Showroom', 'available', false),
('Mitsubishi', 'Outlander', 2021, 25000, 3800000, 'Like New', 'Red', 'Automatic', 'Petrol', 'Modern 7-seater SUV with advanced safety and comfort features.', 'Thika Branch', 'available', false);

-- Create storage bucket for car images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create sales_agreements table for storing agreement records
DROP TABLE IF EXISTS sales_agreements CASCADE;
CREATE TABLE sales_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_number TEXT UNIQUE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  
  -- Car details snapshot (in case car is deleted later)
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year INTEGER NOT NULL,
  car_mileage INTEGER,
  car_color TEXT,
  car_transmission TEXT,
  car_fuel_type TEXT,
  car_condition TEXT,
  car_image TEXT,
  
  -- Seller details
  seller_name TEXT NOT NULL,
  seller_id_type TEXT NOT NULL,
  seller_id_number TEXT NOT NULL,
  seller_kra_pin TEXT,
  seller_phone TEXT NOT NULL,
  seller_email TEXT,
  seller_address TEXT NOT NULL,
  
  -- Buyer details
  buyer_name TEXT NOT NULL,
  buyer_id_type TEXT NOT NULL,
  buyer_id_number TEXT NOT NULL,
  buyer_kra_pin TEXT,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT,
  buyer_address TEXT NOT NULL,
  
  -- Sale details
  sale_price NUMERIC NOT NULL,
  deposit_amount NUMERIC DEFAULT 0,
  balance_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  sale_date DATE NOT NULL,
  transfer_date DATE,
  additional_terms TEXT,
  
  -- Witness details
  witness_name TEXT,
  witness_id TEXT,
  witness_phone TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for sales_agreements
ALTER TABLE sales_agreements ENABLE ROW LEVEL SECURITY;

-- Create policy for sales_agreements
CREATE POLICY "Allow all operations on sales_agreements" ON sales_agreements FOR ALL USING (true) WITH CHECK (true);

-- Create storage policies
DO $$
BEGIN
  -- Drop existing storage policies
  DROP POLICY IF EXISTS "Car images are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can upload car images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can update car images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can delete car images" ON storage.objects;
  
  -- Create new storage policies
  CREATE POLICY "Car images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

  CREATE POLICY "Anyone can upload car images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'car-images');

  CREATE POLICY "Anyone can update car images" ON storage.objects
  FOR UPDATE WITH CHECK (bucket_id = 'car-images');

  CREATE POLICY "Anyone can delete car images" ON storage.objects
  FOR DELETE USING (bucket_id = 'car-images');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;