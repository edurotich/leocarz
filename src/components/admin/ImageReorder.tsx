'use client';

import { useState, useRef } from 'react';

interface ImageReorderProps {
  images: string[];
  onReorder: (reorderedImages: string[]) => void;
  onRemove: (index: number) => void;
  className?: string;
}

export default function ImageReorder({ images, onReorder, onRemove, className = '' }: ImageReorderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedItemRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image
    if (draggedItemRef.current) {
      const rect = draggedItemRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(draggedItemRef.current, rect.width / 2, rect.height / 2);
    }
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    
    // Remove the dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at the new position
    const insertIndex = draggedIndex < index ? index - 1 : index;
    newImages.splice(insertIndex, 0, draggedItem);
    
    onReorder(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newImages = [...images];
    const item = newImages.splice(fromIndex, 1)[0];
    newImages.splice(toIndex, 0, item);
    onReorder(newImages);
  };

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No images to arrange</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Arrange Images ({images.length})
        </h4>
        <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
          Drag to reorder • First image is the main photo
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            ref={draggedIndex === index ? draggedItemRef : null}
            className={`relative group cursor-move transition-all duration-200 ${
              draggedIndex === index 
                ? 'opacity-50 scale-105 z-10' 
                : dragOverIndex === index 
                ? 'scale-105 ring-2 ring-blue-400' 
                : 'hover:scale-102'
            }`}
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop(index)}
            onDragEnd={handleDragEnd}
          >
            {/* Main Image Container */}
            <div className={`relative overflow-hidden rounded-lg border-2 transition-all ${
              index === 0 
                ? 'border-green-400 ring-2 ring-green-100' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <img
                src={image}
                alt={`Car image ${index + 1}`}
                className="w-full h-28 object-cover"
                draggable={false}
              />
              
              {/* Drag Handle Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>

              {/* Position Badge */}
              <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded shadow-sm ${
                index === 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-800 bg-opacity-75 text-white'
              }`}>
                {index === 0 ? 'MAIN' : `#${index + 1}`}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors opacity-0 group-hover:opacity-100"
                title="Remove image"
              >
                ×
              </button>
            </div>

            {/* Arrow Navigation Buttons */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                  title="Move left"
                >
                  ←
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                  title="Move right"
                >
                  →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-xs text-blue-700 space-y-1">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>The <strong>first image (MAIN)</strong> will be the primary photo displayed in listings</span>
          </div>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span>Drag images to reorder or use the arrow buttons</span>
          </div>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Hover over an image and click × to remove it</span>
          </div>
        </div>
      </div>
    </div>
  );
}