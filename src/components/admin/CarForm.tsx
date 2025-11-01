'use client';

import { useState } from 'react';
import { supabase, uploadCarImage, deleteCarImage } from '@/lib/supabase';
import { Car, CarInsert } from '@/types/database';

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
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {car ? 'Edit Car' : 'Add New Car'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              {/* Make */}
              <div className="form-group">
                <label htmlFor="make" className="form-label required">
                  Car Make
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  required
                  value={formData.make}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Toyota, BMW, Mercedes"
                />
              </div>

              {/* Model */}
              <div className="form-group">
                <label htmlFor="model" className="form-label required">
                  Car Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Camry, X5, C-Class"
                />
              </div>

              {/* Year */}
              <div className="form-group">
                <label htmlFor="year" className="form-label required">
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (KSh) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Mileage */}
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  min="0"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Transmission */}
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="LPG">LPG</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Hidden */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_hidden"
                  name="is_hidden"
                  checked={formData.is_hidden}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="is_hidden" className="ml-2 block text-sm text-gray-900">
                  Hide from public listing
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Detailed description of the car..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Current Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Car ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">New Images to Upload:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can select multiple images. Recommended: 1-6 high-quality photos.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-enhanced btn-primary-enhanced"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : car ? '✏️ Update Car' : '➕ Add Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}