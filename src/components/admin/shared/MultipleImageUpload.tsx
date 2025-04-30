
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, MoveUp, MoveDown } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface MultipleImageUploadProps {
  currentImages: string[];
  onFilesChange: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({ 
  currentImages, 
  onFilesChange,
  onRemoveImage 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length) {
      // Validate files
      const validFiles = files.filter(file => {
        // Check file type
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        if (!isValidType) {
          toast.error(`${file.name}: Formato de arquivo inválido. Use JPG, PNG ou WebP.`);
          return false;
        }
        
        // Check file size (max 4MB)
        const isValidSize = file.size <= 4 * 1024 * 1024;
        if (!isValidSize) {
          toast.error(`${file.name}: Arquivo muito grande. Máximo 4MB.`);
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length) {
        setSelectedFiles([...selectedFiles, ...validFiles]);
        onFilesChange([...selectedFiles, ...validFiles]);
      }
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
  };
  
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (currentImages.length <= 1) return;
    
    const newImages = [...currentImages];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      onRemoveImage(-1); // Trigger update without removing
    } else if (direction === 'down' && index < currentImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      onRemoveImage(-1); // Trigger update without removing
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Existing Images Preview */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {currentImages.map((imageUrl, index) => (
            <div key={`existing-${index}`} className="relative group border rounded-md overflow-hidden">
              <img 
                src={imageUrl} 
                alt={`Image ${index + 1}`} 
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === currentImages.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {selectedFiles.map((file, index) => (
            <div key={`new-${index}`} className="relative group border rounded-md overflow-hidden">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`New Image ${index + 1}`} 
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="destructive" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Area */}
      <div className="border-2 border-dashed rounded-md p-6 text-center bg-gray-50">
        <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Clique para adicionar imagens</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP (máx. 4MB por imagem)</p>
      </div>
      
      <div>
        <input
          type="file"
          id="images-upload"
          className="sr-only"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="images-upload">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => document.getElementById('images-upload')?.click()}
          >
            Adicionar Imagens
          </Button>
        </label>
      </div>
    </div>
  );
};
