
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Trash2 } from 'lucide-react';

interface ReportItemProps {
  report: any;
  reportType: 'waste' | 'flood' | 'electricity';
  onDelete: (reportType: string, reportId: string) => void;
  formatDate: (dateStr: string) => string;
}

const ReportItem: React.FC<ReportItemProps> = ({ report, reportType, onDelete, formatDate }) => {
  const getTitleField = () => {
    switch (reportType) {
      case 'waste':
        return report.wasteType;
      case 'flood':
        return report.floodType;
      case 'electricity':
        return report.issueType;
      default:
        return '';
    }
  };

  const getPointsClass = () => {
    switch (reportType) {
      case 'waste':
        return 'text-primary';
      case 'flood':
        return 'text-flood';
      case 'electricity':
        return 'text-energy';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-secondary/20 rounded-lg mb-3">
      <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
        <img src={report.image} alt={reportType} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{getTitleField()}</h4>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onDelete(reportType, report.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {report.location.address}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(report.timestamp)}
        </div>
        <div className={`mt-2 text-xs font-medium ${getPointsClass()}`}>
          +{report.points} points
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
