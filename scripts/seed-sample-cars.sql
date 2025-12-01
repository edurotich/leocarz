-- Sample Car Data for LeoCarZ
-- Run this in your Supabase SQL Editor to populate the database with sample cars

INSERT INTO cars (make, model, year, mileage, price, condition, color, transmission, fuel_type, description, location, images, status, is_hidden) VALUES
-- Toyota Vehicles
('Toyota', 'Land Cruiser Prado', 2022, 15000, 6500000, 'Excellent', 'Pearl White', 'Automatic', 'Diesel', 'Immaculate 2022 Toyota Land Cruiser Prado in pristine condition. Full service history, leather interior, sunroof, and all modern safety features. Perfect for families and off-road adventures.', 'Eldoret', ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

('Toyota', 'Hilux Double Cab', 2021, 45000, 4200000, 'Excellent', 'Silver', 'Manual', 'Diesel', 'Reliable Toyota Hilux Double Cab, perfect for both business and personal use. 4WD, excellent fuel economy, and legendary Toyota durability. Recently serviced.', 'Eldoret', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

('Toyota', 'Corolla', 2020, 62000, 1850000, 'Good', 'Blue', 'Automatic', 'Petrol', 'Well-maintained Toyota Corolla, perfect city car with excellent fuel economy. One owner, full service history, clean interior and exterior.', 'Nairobi', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Nissan Vehicles
('Nissan', 'X-Trail', 2019, 78000, 2650000, 'Good', 'Black', 'Automatic', 'Petrol', 'Spacious Nissan X-Trail with 7 seats, perfect for large families. Features include reverse camera, navigation system, and climate control. Well maintained with complete service records.', 'Mombasa', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

('Nissan', 'Note', 2018, 95000, 1250000, 'Good', 'Red', 'Automatic', 'Petrol', 'Economical Nissan Note, perfect for daily commuting. Compact yet spacious, excellent fuel efficiency, and reliable performance. Recently serviced.', 'Kisumu', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Subaru Vehicles
('Subaru', 'Forester', 2021, 35000, 3800000, 'Excellent', 'Dark Gray', 'Automatic', 'Petrol', 'Premium Subaru Forester with AWD, perfect for Kenyan roads. Features include EyeSight safety system, leather seats, and panoramic sunroof. Like new condition.', 'Nakuru', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'], 'available', false),

('Subaru', 'Impreza', 2019, 68000, 2100000, 'Good', 'Blue', 'Automatic', 'Petrol', 'Sporty Subaru Impreza with AWD, great handling and performance. Well-maintained with full service history. Perfect for enthusiasts.', 'Eldoret', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Honda Vehicles
('Honda', 'CR-V', 2020, 52000, 3200000, 'Excellent', 'White', 'Automatic', 'Petrol', 'Luxurious Honda CR-V with premium features. Spacious interior, advanced safety features, and excellent fuel economy. Perfect family SUV.', 'Nairobi', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'], 'available', false),

('Honda', 'Fit', 2017, 105000, 980000, 'Fair', 'Silver', 'Automatic', 'Petrol', 'Reliable Honda Fit, perfect for city driving. Economical and practical with Honda''s legendary reliability. Some wear but mechanically sound.', 'Thika', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Mazda Vehicles
('Mazda', 'CX-5', 2021, 28000, 3950000, 'Excellent', 'Soul Red', 'Automatic', 'Petrol', 'Stunning Mazda CX-5 in signature Soul Red. Premium interior, advanced safety features, and exceptional driving dynamics. Nearly new condition.', 'Eldoret', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'], 'available', false),

('Mazda', 'Demio', 2016, 120000, 850000, 'Fair', 'White', 'Automatic', 'Petrol', 'Economical Mazda Demio, perfect first car or city runabout. Good fuel economy and reliable performance. Well maintained despite high mileage.', 'Kisumu', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Mercedes-Benz (Luxury)
('Mercedes-Benz', 'E-Class', 2020, 42000, 7200000, 'Excellent', 'Black', 'Automatic', 'Diesel', 'Luxurious Mercedes-Benz E-Class with premium features. Leather interior, advanced driver assistance, and exceptional comfort. Perfect executive car.', 'Nairobi', ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- BMW (Luxury)
('BMW', 'X5', 2019, 55000, 6800000, 'Excellent', 'Alpine White', 'Automatic', 'Diesel', 'Premium BMW X5 with M Sport package. Powerful, luxurious, and packed with technology. Full service history and immaculate condition.', 'Nairobi', ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Mitsubishi
('Mitsubishi', 'Outlander', 2018, 88000, 2450000, 'Good', 'Gray', 'Automatic', 'Petrol', 'Spacious Mitsubishi Outlander with 7 seats. Great for families, reliable performance, and good fuel economy. Well maintained with service history.', 'Mombasa', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'available', false),

-- Volkswagen
('Volkswagen', 'Tiguan', 2020, 48000, 4100000, 'Excellent', 'Blue', 'Automatic', 'Diesel', 'Premium Volkswagen Tiguan with advanced features. Comfortable, efficient, and stylish. Perfect blend of luxury and practicality.', 'Eldoret', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'], 'available', false),

-- Sold Cars (for demonstration)
('Toyota', 'Vitz', 2015, 145000, 750000, 'Fair', 'Silver', 'Automatic', 'Petrol', 'SOLD - Economical Toyota Vitz, perfect city car. Good fuel economy and reliable Toyota quality.', 'Nairobi', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'sold', false),

('Nissan', 'Juke', 2017, 92000, 1650000, 'Good', 'Red', 'Automatic', 'Petrol', 'SOLD - Stylish Nissan Juke with unique design. Fun to drive and economical.', 'Eldoret', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'sold', false),

('Honda', 'Vezel', 2019, 65000, 2850000, 'Excellent', 'White', 'Automatic', 'Hybrid', 'SOLD - Premium Honda Vezel Hybrid with excellent fuel economy. Modern features and stylish design.', 'Nairobi', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'sold', false);

-- Verify the insert
SELECT COUNT(*) as total_cars, 
       SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_cars,
       SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_cars
FROM cars;
