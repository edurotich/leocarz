// Test Supabase connection
// You can run this in your browser console on the admin page

console.log('Testing Supabase connection...');

// Test 1: Check if supabase client is working
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Test 2: Try to connect to the cars table
async function testConnection() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      'https://urdmgwuhamxuvtgqggty.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZG1nd3VoYW14dXZ0Z3FnZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDg4MzAsImV4cCI6MjA3MzE4NDgzMH0.SrQV9EFgmvElrihDwjN37tJw0uGWgtiJHnWTQDGcDVY'
    );
    
    console.log('Testing cars table access...');
    const { data, error, count } = await supabase
      .from('cars')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('❌ Database Error:', error);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`Found ${count} cars in database`);
    console.log('Sample data:', data);
    return true;
    
  } catch (err) {
    console.error('❌ Connection failed:', err);
    return false;
  }
}

testConnection();