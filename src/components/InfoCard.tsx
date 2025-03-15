
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'waste' | 'flood' | 'energy' | 'primary';
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon: Icon,
  color = 'primary',
  children,
  footer
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'waste': return 'text-waste bg-waste/10';
      case 'flood': return 'text-flood bg-flood/10';
      case 'energy': return 'text-energy bg-energy/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card className="glass-card overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${getColorClass()}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
      {footer && (
        <CardFooter className="border-t bg-secondary/20">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default InfoCard;
