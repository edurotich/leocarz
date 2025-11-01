import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to upload images to Supabase Storage
export async function uploadCarImage(file: File, carId: string, imageIndex: number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${carId}-${imageIndex}.${fileExt}`;
  const filePath = `cars/${fileName}`;

  const { data, error } = await supabase.storage
    .from('car-images')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Helper function to delete images from Supabase Storage
export async function deleteCarImage(imagePath: string) {
  // Extract the path from the full URL
  const path = imagePath.split('/car-images/')[1];
  
  const { error } = await supabase.storage
    .from('car-images')
    .remove([`cars/${path}`]);

  if (error) {
    throw error;
  }
}