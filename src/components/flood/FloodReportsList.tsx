
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, MessageSquare } from 'lucide-react';

interface ReportedItem {
  id: string;
  image: string;
  floodType: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  comment: string;
  timestamp: string;
  points: number;
}

interface FloodReportsListProps {
  reports: ReportedItem[];
}

const FloodReportsList: React.FC<FloodReportsListProps> = ({ reports }) => {
  if (reports.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recent Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                <img 
                  src={item.image} 
                  alt="Reported flood" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.floodType}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location.address}
                </div>
                {item.comment && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {item.comment.length > 50 ? item.comment.substring(0, 50) + '...' : item.comment}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
                <div className="text-xs font-medium text-flood">
                  +{item.points} points
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FloodReportsList;
