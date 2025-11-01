/**
 * Utility functions for formatting currency and other values
 */

/**
 * Format price in Kenya Shillings
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format mileage with appropriate unit
 */
export const formatMileage = (mileage: number | null): string => {
  if (!mileage) return 'Not specified';
  return new Intl.NumberFormat('en-KE').format(mileage) + ' km';
};

/**
 * Format large numbers with K/M suffix
 */
export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-KE', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

/**
 * Format date in Kenyan locale
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (): string => 'KSh';

/**
 * Popular car makes in Kenya (ordered by popularity)
 */
export const POPULAR_CAR_MAKES = [
  'Toyota',
  'Nissan', 
  'Honda',
  'Subaru',
  'Mitsubishi',
  'Mazda',
  'Isuzu',
  'Suzuki',
  'Hyundai',
  'Kia',
  'Ford',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Land Rover',
  'Jeep',
  'Peugeot',
  'Renault',
  'Volvo',
  'Lexus',
  'Infiniti',
  'Acura',
  'Chevrolet',
  'Opel',
  'Fiat',
  'Skoda',
  'Daihatsu',
] as const;

/**
 * Common car conditions
 */
export const CAR_CONDITIONS = [
  'Like New',
  'Excellent', 
  'Good',
  'Fair',
  'Poor',
] as const;

/**
 * Fuel types common in Kenya
 */
export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Hybrid',
  'Electric',
] as const;

/**
 * Transmission types
 */
export const TRANSMISSION_TYPES = [
  'Manual',
  'Automatic',
  'CVT',
] as const;

/**
 * Major cities/locations in Kenya for car dealerships
 */
export const KENYA_LOCATIONS = [
  'Nairobi',
  'Mombasa', 
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Machakos',
  'Meru',
  'Nyeri',
  'Kitale',
  'Garissa',
  'Kakamega',
  'Malindi',
  'Kitui',
  'Embu',
] as const;