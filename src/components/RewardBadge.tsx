
import React from 'react';
import { Award } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RewardBadgeProps {
  points: number;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ points }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-secondary flex items-center gap-1.5 py-1.5 pl-2 pr-3 rounded-full cursor-pointer hover:bg-secondary/80 transition-colors">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{points}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">You have {points} reward points</p>
          <p className="text-xs text-muted-foreground">Earn more by contributing to the platform</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RewardBadge;
