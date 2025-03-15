
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudRain, AlertTriangle, Frown, Check } from 'lucide-react';
import InfoCard from '@/components/InfoCard';

interface FloodInfoSidebarProps {
  hasReports: boolean;
}

const FloodInfoSidebar: React.FC<FloodInfoSidebarProps> = ({ hasReports }) => {
  return (
    <div className="space-y-6">
      <InfoCard
        title="About Flood Reporting"
        description="Mumbai faces significant flooding during monsoon seasons, affecting millions of residents."
        icon={CloudRain}
        color="flood"
      >
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            Timely flood reporting helps authorities respond quickly to affected areas, 
            potentially saving lives and reducing property damage. By reporting flooding, 
            you help create a real-time map of affected areas in Mumbai.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <div className="text-2xl font-bold text-flood">60%</div>
              <div className="text-xs text-muted-foreground">Of Mumbai at risk</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <div className="text-2xl font-bold text-flood">2,000+</div>
              <div className="text-xs text-muted-foreground">Reports last monsoon</div>
            </div>
          </div>
        </div>
      </InfoCard>
      
      <InfoCard
        title="How You Can Help"
        description="Your contributions can make a difference during flooding events."
        icon={AlertTriangle}
        color="flood"
      >
        <ul className="space-y-2 mt-2">
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-flood mt-0.5" />
            <span>Report flooding with precise location</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-flood mt-0.5" />
            <span>Upload clear photos of flooding</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-flood mt-0.5" />
            <span>Add details about water levels</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-flood mt-0.5" />
            <span>Share emergency contact information</span>
          </li>
        </ul>
      </InfoCard>
      
      {!hasReports && (
        <InfoCard
          title="No Reports Yet"
          description="You haven't submitted any flood reports yet."
          icon={Frown}
          color="primary"
        >
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Start by uploading a photo of flooding using the form. Your reports help 
              create a real-time map of flood-affected areas in Mumbai.
            </p>
            <Button variant="outline" className="w-full" onClick={() => document.getElementById('flood-report')?.scrollIntoView({ behavior: 'smooth' })}>
              Make Your First Report
            </Button>
          </div>
        </InfoCard>
      )}
    </div>
  );
};

export default FloodInfoSidebar;
