
/**
 * Utilities for handling image compression and optimization
 */

/**
 * Compresses an image if it exceeds certain size thresholds
 * @param file - The image file to compress
 * @returns A promise resolving to the compressed file or original file if compression not needed
 */
export const compressImageIfNeeded = async (file: File): Promise<File> => {
  // If the file is smaller than 2MB, don't compress
  if (file.size <= 2 * 1024 * 1024) return file;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize large images
        const MAX_DIMENSION = 1800;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Quality adjusted based on original size
        let quality = 0.7;
        if (file.size > 4 * 1024 * 1024) quality = 0.5;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            console.log(`Image compressed from ${file.size / 1024}KB to ${newFile.size / 1024}KB`);
            resolve(newFile);
          },
          'image/jpeg',
          quality
        );
      };
    };
  });
};
