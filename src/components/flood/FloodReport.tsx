
import React, { useState } from 'react';
import { CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';
import LocationPicker from '@/components/LocationPicker';
import FloodRecommendations from './FloodRecommendations';

interface FloodReportProps {
  onSubmit: (data: {
    image: string;
    floodType: string;
    location: { address: string; latitude: number; longitude: number };
    comment: string;
  }) => void;
  isSubmitting: boolean;
}

const FloodReport: React.FC<FloodReportProps> = ({ onSubmit, isSubmitting }) => {
  const [image, setImage] = useState<string | null>(null);
  const [floodType, setFloodType] = useState<string | null>(null);
  const [location, setLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  const [comment, setComment] = useState('');

  const handleImageProcessed = (imageUrl: string, type: string) => {
    setImage(imageUrl);
    setFloodType(type);
  };

  const handleLocationSelected = (loc: { address: string; latitude: number; longitude: number }) => {
    setLocation(loc);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (image && floodType && location) {
      onSubmit({
        image,
        floodType,
        location,
        comment
      });
      
      // Reset form
      setImage(null);
      setFloodType(null);
      setLocation(null);
      setComment('');
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Report Flooding</CardTitle>
        <CardDescription>
          Upload a photo of flooding to help authorities assess the situation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ImageUploader onImageProcessed={handleImageProcessed} type="flood" />
        
        {floodType && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-blue-100 text-blue-600">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium mb-1">Identified as: {floodType}</div>
                  <p className="text-sm text-muted-foreground">
                    This looks like a flood-affected area. Your report will help authorities respond.
                  </p>
                </div>
              </div>
            </div>
            
            <FloodRecommendations floodType={floodType} />
          </div>
        )}
        
        {image && (
          <>
            <Separator />
            
            <LocationPicker onLocationSelected={handleLocationSelected} />
            
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Additional Comments
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add any details about the flooding or location that might be helpful..."
                className="resize-none"
                rows={3}
              />
            </div>
          </>
        )}
      </CardContent>
      
      {image && floodType && location && (
        <CardFooter className="border-t bg-secondary/20 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Submit this report to earn 15 points
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            Submit Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FloodReport;
