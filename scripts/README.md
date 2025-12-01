# Sample Car Data Seed Script

This SQL script populates the LeoCarZ database with 18 sample car listings to demonstrate the platform's functionality.

## What's Included

- **15 Available Cars**: Mix of popular makes and models
- **3 Sold Cars**: For demonstrating sold status
- **Diverse Price Range**: KSh 750,000 to KSh 7,200,000
- **Multiple Locations**: Eldoret, Nairobi, Mombasa, Kisumu, Nakuru, Thika
- **Various Conditions**: Excellent, Good, Fair
- **Different Fuel Types**: Petrol, Diesel, Hybrid

## Car Brands Included

- Toyota (Land Cruiser Prado, Hilux, Corolla, Vitz)
- Nissan (X-Trail, Note, Juke)
- Subaru (Forester, Impreza)
- Honda (CR-V, Fit, Vezel)
- Mazda (CX-5, Demio)
- Mercedes-Benz (E-Class)
- BMW (X5)
- Mitsubishi (Outlander)
- Volkswagen (Tiguan)

## How to Use

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `seed-sample-cars.sql`
4. Paste into the SQL editor
5. Click **Run** to execute

### Option 2: Command Line (if you have Supabase CLI)
```bash
# From the project root
supabase db execute -f scripts/seed-sample-cars.sql
```

## Verification

After running the script, you should see:
- **Total Cars**: 18
- **Available**: 15
- **Sold**: 3

The script includes a verification query at the end that will show these counts.

## Notes

- Images use Unsplash placeholder URLs
- All data is realistic and based on actual Kenyan car market prices
- Mileage and years are varied to show different vehicle conditions
- Descriptions are detailed to demonstrate the platform's capabilities

## Customization

Feel free to modify:
- Prices to match current market rates
- Locations to your target areas
- Add more cars by copying the INSERT pattern
- Replace placeholder images with actual car photos

## Clearing Sample Data

If you want to remove all sample data later:
```sql
DELETE FROM cars WHERE description LIKE '%SOLD -%' OR created_at > '2025-12-01';
```

**Warning**: This will delete cars created after the specified date. Adjust the date as needed.
