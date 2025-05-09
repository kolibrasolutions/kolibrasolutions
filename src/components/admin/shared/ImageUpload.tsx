
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ImageUploadProps {
  currentImageUrl: string | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ currentImageUrl, onFileChange, disabled = false }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Formato de arquivo inválido. Use JPG, PNG ou WebP.');
        return;
      }
      
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 4MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    }
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    onFileChange(null);
  };
  
  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-[200px] rounded-md object-contain border"
          />
          <Button 
            variant="destructive" 
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={clearImage}
            disabled={disabled}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-6 text-center bg-gray-50">
          <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Clique para fazer upload</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP (máx. 4MB)</p>
        </div>
      )}
      
      <div>
        <input
          type="file"
          id="image-upload"
          className="sr-only"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <label htmlFor="image-upload">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            disabled={disabled}
            onClick={() => !disabled && document.getElementById('image-upload')?.click()}
          >
            {previewUrl ? 'Trocar Imagem' : 'Selecionar Imagem'}
          </Button>
        </label>
      </div>
    </div>
  );
};
