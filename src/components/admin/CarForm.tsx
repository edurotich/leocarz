'use client';

import { useState } from 'react';
import { supabase, uploadCarImage, deleteCarImage } from '@/lib/supabase';
import { Car, CarInsert } from '@/types/database';

// Smart dropdown data
const CAR_MAKES = [
  'Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Isuzu', 'Kia', 'Land Rover', 
  'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Peugeot', 'Subaru', 'Suzuki', 
  'Toyota', 'Volkswagen', 'Volvo', 'Other'
];

const CAR_MODELS_BY_MAKE: Record<string, string[]> = {
  'Toyota': ['Camry', 'Corolla', 'Prius', 'RAV4', 'Highlander', 'Prado', 'Hilux', 'Vitz', 'Harrier', 'Mark X', 'Crown', 'Vanguard'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Ridgeline', 'Passport', 'Insight', 'Vezel'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'i3', 'i8', 'Z4'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'CLA', 'CLS'],
  'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'X-Trail', 'Note', 'Juke', '370Z'],
  'Ford': ['Focus', 'Fiesta', 'Mustang', 'Explorer', 'Escape', 'Edge', 'F-150', 'Ranger', 'Fusion'],
  'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'Touareg', 'Beetle', 'Arteon'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Genesis', 'Veloster', 'Kona', 'Palisade'],
  'Kia': ['Forte', 'Optima', 'Sorento', 'Sportage', 'Soul', 'Stinger', 'Telluride', 'Rio'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-30'],
  'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Ascent', 'WRX', 'BRZ'],
  'Mitsubishi': ['Lancer', 'Outlander', 'Eclipse Cross', 'Mirage', 'Pajero', 'ASX'],
  'Isuzu': ['D-Max', 'MU-X', 'NPR', 'Trooper', 'Rodeo'],
  'Suzuki': ['Swift', 'Vitara', 'SX4', 'Jimny', 'Alto', 'Baleno', 'Ignis'],
  'Land Rover': ['Discovery', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Defender'],
  'Peugeot': ['208', '308', '3008', '5008', '508', '2008'],
  'Chevrolet': ['Spark', 'Cruze', 'Malibu', 'Equinox', 'Traverse', 'Tahoe', 'Silverado'],
  'Volvo': ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'V60', 'V90'],
  'Other': ['Enter manually']
};

const COLORS = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige', 
  'Gold', 'Yellow', 'Orange', 'Purple', 'Pink', 'Maroon', 'Navy', 'Other'
];

const KENYAN_LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 
  'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho',
  'Kisii', 'Kilifi', 'Lamu', 'Nanyuki', 'Naivasha', 'Isiolo', 'Other'
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1990 + 2 }, (_, i) => CURRENT_YEAR + 1 - i);

interface CarFormProps {
  car?: Car | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CarForm({ car, onClose, onSaved }: CarFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: car?.make || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    mileage: car?.mileage || '',
    price: car?.price || '',
    condition: car?.condition || 'Used',
    color: car?.color || '',
    transmission: car?.transmission || '',
    fuel_type: car?.fuel_type || '',
    description: car?.description || '',
    location: car?.location || '',
    status: car?.status || 'available',
    is_hidden: car?.is_hidden || false,
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(car?.images || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>(
    formData.make ? CAR_MODELS_BY_MAKE[formData.make] || [] : []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : '' }));
    } else {
      // Handle make selection to update available models
      if (name === 'make') {
        setFormData(prev => ({ ...prev, [name]: value, model: '' })); // Reset model when make changes
        setAvailableModels(value ? CAR_MODELS_BY_MAKE[value] || [] : []);
        if (value !== 'Other') setCustomMake('');
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Reset custom inputs when switching away from "Other"
        if (name === 'model' && value !== 'Enter manually') setCustomModel('');
        if (name === 'color' && value !== 'Other') setCustomColor('');
        if (name === 'location' && value !== 'Other') setCustomLocation('');
      }
    }
  };

  const handleCustomInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setImagesToDelete(prev => [...prev, imageToRemove]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting form submission...');
      
      // Validate required fields
      if (!formData.make || !formData.model || !formData.price) {
        alert('Please fill in all required fields (Make, Model, Price)');
        setLoading(false);
        return;
      }

      console.log('Form data:', formData);

      let carData: CarInsert | Car = {
        ...formData,
        mileage: formData.mileage ? parseFloat(formData.mileage.toString()) : null,
        price: parseFloat(formData.price.toString()),
        images: [...existingImages],
      };

      console.log('Prepared car data:', carData);

      let carId: string;

      // Save or update car
      if (car) {
        // Update existing car
        console.log('Updating existing car...');
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', car.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        carId = car.id;
      } else {
        // Create new car
        console.log('Creating new car...');
        const { data, error } = await supabase
          .from('cars')
          .insert([carData])
          .select()
          .single();

        console.log('Insert response:', { data, error });

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('No data returned from insert');
        }
        
        carId = data.id;
        console.log('Car created successfully with ID:', carId);
      }

      // Upload new images
      const uploadedImageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        try {
          const imageUrl = await uploadCarImage(file, carId, Date.now() + i);
          uploadedImageUrls.push(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }

      // Delete removed images
      for (const imageUrl of imagesToDelete) {
        try {
          await deleteCarImage(imageUrl);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }

      // Update car with all image URLs
      if (uploadedImageUrls.length > 0) {
        const allImages = [...existingImages, ...uploadedImageUrls];
        const { error } = await supabase
          .from('cars')
          .update({ images: allImages })
          .eq('id', carId);

        if (error) throw error;
      }

      console.log('Car saved successfully!');
      alert('Car saved successfully!');
      onSaved();
    } catch (error) {
      console.error('Error saving car:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to save car. ';
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      
      // Check for specific Supabase errors
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage += '\n\nDetails: ' + error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full my-8 shadow-2xl">
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {car ? (
                  <>
                    <svg className="w-8 h-8 mr-3 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Car Details
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 mr-3 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add New Car
                  </>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {car ? 'Update the car information below' : 'Fill in the details for the new car listing'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-white/50 transition-colors"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="max-h-[75vh] overflow-y-auto p-6">

          <form onSubmit={handleSubmit} className="form-container admin-form">
            {/* Vehicle Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                🚗 Vehicle Information
              </h3>
              <div className="form-row">
                {/* Make */}
                <div className="form-group">
                  <label htmlFor="make" className="form-label required">
                    Car Make
                  </label>
                  <select
                    id="make"
                    name="make"
                    required
                    value={formData.make}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Make</option>
                    {CAR_MAKES.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                  {formData.make === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter custom make"
                      value={customMake}
                      onChange={(e) => {
                        setCustomMake(e.target.value);
                        handleCustomInputChange('make', e.target.value);
                      }}
                      className="form-input mt-2"
                      required
                    />
                  )}
                </div>

                {/* Model */}
                <div className="form-group">
                  <label htmlFor="model" className="form-label required">
                    Car Model
                  </label>
                  <select
                    id="model"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!formData.make || formData.make === 'Other'}
                  >
                    <option value="">
                      {!formData.make ? 'Select Make First' : 'Select Model'}
                    </option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {formData.model === 'Enter manually' && (
                    <input
                      type="text"
                      placeholder="Enter model name"
                      value={customModel}
                      onChange={(e) => {
                        setCustomModel(e.target.value);
                        handleCustomInputChange('model', e.target.value);
                      }}
                      className="form-input mt-2"
                      required
                    />
                  )}
                </div>

                {/* Year */}
                <div className="form-group">
                  <label htmlFor="year" className="form-label required">
                    Manufacturing Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div className="form-group">
                  <label htmlFor="condition" className="form-label required">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="New">🌟 New</option>
                    <option value="Like New">✨ Like New</option>
                    <option value="Excellent">🔥 Excellent</option>
                    <option value="Good">👍 Good</option>
                    <option value="Fair">⚖️ Fair</option>
                    <option value="Used">🔧 Used</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                ⚙️ Specifications
              </h3>
              <div className="form-row">
                {/* Color */}
                <div className="form-group">
                  <label htmlFor="color" className="form-label">
                    Color
                  </label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Color</option>
                    {COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {formData.color === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter custom color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        handleCustomInputChange('color', e.target.value);
                      }}
                      className="form-input mt-2"
                    />
                  )}
                </div>

                {/* Transmission */}
                <div className="form-group">
                  <label htmlFor="transmission" className="form-label">
                    Transmission
                  </label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">🔄 Automatic</option>
                    <option value="Manual">🎛️ Manual</option>
                    <option value="CVT">⚡ CVT</option>
                    <option value="Semi-Automatic">🔀 Semi-Automatic</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div className="form-group">
                  <label htmlFor="fuel_type" className="form-label">
                    Fuel Type
                  </label>
                  <select
                    id="fuel_type"
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">⛽ Petrol</option>
                    <option value="Diesel">🚛 Diesel</option>
                    <option value="Hybrid">🌱 Hybrid</option>
                    <option value="Electric">🔋 Electric</option>
                    <option value="LPG">💨 LPG</option>
                    <option value="CNG">🌿 CNG</option>
                  </select>
                </div>

                {/* Mileage */}
                <div className="form-group">
                  <label htmlFor="mileage" className="form-label">
                    Mileage (KM)
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    min="0"
                    step="1000"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Location Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                💰 Pricing & Location
              </h3>
              <div className="form-row">
                {/* Price */}
                <div className="form-group">
                  <label htmlFor="price" className="form-label required">
                    Price (KSh)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">KSh</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="50000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input pl-12"
                      placeholder="1,500,000"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Location</option>
                    {KENYAN_LOCATIONS.map(location => (
                      <option key={location} value={location}>📍 {location}</option>
                    ))}
                  </select>
                  {formData.location === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={customLocation}
                      onChange={(e) => {
                        setCustomLocation(e.target.value);
                        handleCustomInputChange('location', e.target.value);
                      }}
                      className="form-input mt-2"
                    />
                  )}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Availability Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="available">✅ Available</option>
                    <option value="sold">🔴 Sold</option>
                  </select>
                </div>

                {/* Hidden */}
                <div className="form-group flex items-center justify-center">
                  <div className="flex items-center space-x-3 mt-6">
                    <input
                      type="checkbox"
                      id="is_hidden"
                      name="is_hidden"
                      checked={formData.is_hidden}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_hidden" className="text-sm font-medium text-gray-700">
                      🙈 Hide from public listing
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                📝 Description & Details
              </h3>
              <div>
                <label htmlFor="description" className="form-label">
                  Car Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input resize-none"
                  placeholder="Describe the car's features, condition, history, and any special attributes that make it attractive to buyers..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Include details like service history, special features, recent maintenance, etc.
                </p>
              </div>
            </div>

            {/* Images Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                📸 Car Images
              </h3>
              
              {/* Current Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    🖼️ Current Images ({existingImages.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Car ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition-colors"
                          title="Remove image"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images to Upload */}
              {images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    ⬆️ New Images to Upload ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg border-2 border-blue-200 shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition-colors"
                          title="Remove image"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-blue-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                          NEW
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB each)</p>
                  </div>
                </label>
              </div>
              
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Recommended: 4-8 high-quality photos
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Include exterior, interior, and engine bay
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 pb-4 -mx-6 px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-500">
                  {car ? (
                    <span>✏️ Editing: <strong>{car.make} {car.model}</strong></span>
                  ) : (
                    <span>➕ Adding new car to inventory</span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-enhanced btn-secondary-enhanced"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn-enhanced btn-primary-enhanced min-w-[140px]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : car ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Update Car
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add Car
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Progress indicator */}
              {loading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-sky-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {car ? 'Updating car information...' : 'Adding car to inventory...'}
                  </p>
                </div>
              )}
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}