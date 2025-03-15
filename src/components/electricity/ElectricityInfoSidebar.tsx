
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Frown, Check } from 'lucide-react';
import InfoCard from '@/components/InfoCard';

interface ElectricityInfoSidebarProps {
  hasReports: boolean;
}

const ElectricityInfoSidebar: React.FC<ElectricityInfoSidebarProps> = ({ hasReports }) => {
  return (
    <div className="space-y-6">
      <InfoCard
        title="About Energy Issues"
        description="Mumbai faces regular power outages affecting millions of residents and businesses."
        icon={Zap}
        color="energy"
      >
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            Quick reporting of electricity issues helps utilities pinpoint problems and restore power faster.
            By reporting outages and damaged infrastructure, you help create a more reliable energy grid for Mumbai.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <div className="text-2xl font-bold text-energy">350+</div>
              <div className="text-xs text-muted-foreground">Monthly outages</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <div className="text-2xl font-bold text-energy">2.5 hrs</div>
              <div className="text-xs text-muted-foreground">Avg. restoration time</div>
            </div>
          </div>
        </div>
      </InfoCard>
      
      <InfoCard
        title="How You Can Help"
        description="Your electricity issue reports make a real difference to Mumbai's power grid."
        icon={AlertTriangle}
        color="energy"
      >
        <ul className="space-y-2 mt-2">
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-energy mt-0.5" />
            <span>Report power outages immediately</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-energy mt-0.5" />
            <span>Document damaged electrical infrastructure</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-energy mt-0.5" />
            <span>Note how widespread the outage is</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-energy mt-0.5" />
            <span>Add exact location details</span>
          </li>
        </ul>
      </InfoCard>
      
      {!hasReports && (
        <InfoCard
          title="No Reports Yet"
          description="You haven't submitted any electricity issue reports yet."
          icon={Frown}
          color="primary"
        >
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Start by uploading a photo of an electricity issue using the form. Your reports help
              create a more reliable energy grid for Mumbai.
            </p>
            <Button variant="outline" className="w-full" onClick={() => document.getElementById('electricity-report')?.scrollIntoView({ behavior: 'smooth' })}>
              Make Your First Report
            </Button>
          </div>
        </InfoCard>
      )}
    </div>
  );
};

export default ElectricityInfoSidebar;
