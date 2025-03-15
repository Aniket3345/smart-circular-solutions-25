
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { identifyWasteType, WasteType } from '@/utils/imageRecognition';

interface ImageUploaderProps {
  onImageProcessed: (imageUrl: string, type: string) => void;
  type: 'waste' | 'flood' | 'electricity';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed, type }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Reset states
    setResult(null);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setImageFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    try {
      let resultText: string = '';
      
      if (type === 'waste') {
        const wasteType: WasteType = await identifyWasteType(imageFile);
        resultText = wasteType;
      } else if (type === 'flood') {
        resultText = 'Flood area identified'; // Placeholder
      } else if (type === 'electricity') {
        resultText = 'Electricity issue identified'; // Placeholder
      }
      
      setResult(resultText);
      
      // Call the parent callback with the image and result
      if (image) {
        onImageProcessed(image, resultText);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setResult('Error processing image');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'waste': return 'text-waste';
      case 'flood': return 'text-flood';
      case 'electricity': return 'text-energy';
      default: return 'text-primary';
    }
  };

  const getTypeBackground = () => {
    switch (type) {
      case 'waste': return 'bg-waste/10 border-waste/20';
      case 'flood': return 'bg-flood/10 border-flood/20';
      case 'electricity': return 'bg-energy/10 border-energy/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  };

  const getTypeHeading = () => {
    switch (type) {
      case 'waste': return 'Upload Waste Image';
      case 'flood': return 'Upload Flood Image';
      case 'electricity': return 'Upload Electricity Issue';
      default: return 'Upload Image';
    }
  };

  return (
    <div className="w-full">
      {!image ? (
        <div
          className={`image-upload-zone border-2 ${isDragging ? 'border-primary bg-primary/5' : getTypeBackground()}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
          <Upload className={`w-12 h-12 ${getTypeColor()} mb-3`} />
          <h3 className="text-lg font-medium mb-1">{getTypeHeading()}</h3>
          <p className="text-muted-foreground text-sm mb-4 text-center max-w-md">
            Drag and drop your image here, or click to browse
          </p>
          <Button variant="outline" size="sm" className="rounded-full">
            Select File
          </Button>
        </div>
      ) : (
        <div className="glass-card p-4 animate-scale-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium">Image Preview</h3>
            <Button variant="ghost" size="icon" onClick={resetUpload} className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative rounded-lg overflow-hidden mb-4 aspect-video bg-black/5 flex items-center justify-center">
            <img
              src={image}
              alt="Preview"
              className="max-h-[300px] max-w-full object-contain"
            />
          </div>
          
          {result ? (
            <div className="mb-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <p className="font-medium">{result}</p>
              </div>
            </div>
          ) : (
            <Button
              onClick={processImage}
              disabled={isProcessing}
              className="w-full rounded-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Image'
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
