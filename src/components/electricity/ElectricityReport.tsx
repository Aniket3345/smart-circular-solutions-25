
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
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
import ElectricityRecommendations from './ElectricityRecommendations';

interface ElectricityReportProps {
  onSubmit: (data: {
    image: string;
    issueType: string;
    location: { address: string; latitude: number; longitude: number };
    comment: string;
  }) => void;
  isSubmitting: boolean;
}

const ElectricityReport: React.FC<ElectricityReportProps> = ({ onSubmit, isSubmitting }) => {
  const [image, setImage] = useState<string | null>(null);
  const [issueType, setIssueType] = useState<string | null>(null);
  const [location, setLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  const [comment, setComment] = useState('');

  const handleImageProcessed = (imageUrl: string, type: string) => {
    setImage(imageUrl);
    setIssueType(type);
  };

  const handleLocationSelected = (loc: { address: string; latitude: number; longitude: number }) => {
    setLocation(loc);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (image && issueType && location) {
      onSubmit({
        image,
        issueType,
        location,
        comment
      });
      
      // Reset form
      setImage(null);
      setIssueType(null);
      setLocation(null);
      setComment('');
    }
  };

  return (
    <Card className="glass-card" id="electricity-report">
      <CardHeader>
        <CardTitle>Report Electricity Issue</CardTitle>
        <CardDescription>
          Upload a photo of electrical problems to help utilities address them quickly
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ImageUploader onImageProcessed={handleImageProcessed} type="electricity" />
        
        {issueType && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-yellow-100 text-yellow-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium mb-1">Identified as: {issueType}</div>
                  <p className="text-sm text-muted-foreground">
                    This appears to be an electricity issue. Your report will help utilities respond effectively.
                  </p>
                </div>
              </div>
            </div>
            
            <ElectricityRecommendations issueType={issueType} />
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
                placeholder="Add any details about the electricity issue that might be helpful..."
                className="resize-none"
                rows={3}
              />
            </div>
          </>
        )}
      </CardContent>
      
      {image && issueType && location && (
        <CardFooter className="border-t bg-secondary/20 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Submit this report to earn 12 points
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

export default ElectricityReport;
