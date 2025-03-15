
import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/utils/auth';

interface RewardPointsCardProps {
  user: User | null;
  totalReports: number;
}

const RewardPointsCard: React.FC<RewardPointsCardProps> = ({ user, totalReports }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Reward Points
        </CardTitle>
        <CardDescription>Your contribution rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold text-primary">{user?.rewardPoints || 0}</div>
          <p className="text-sm text-center text-muted-foreground">
            You've earned {user?.rewardPoints || 0} points by contributing to your community.
            Keep reporting issues to earn more rewards.
          </p>
          <div className="w-full pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Total Reports</span>
              <span className="font-medium">{totalReports}</span>
            </div>
            <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${Math.min((totalReports / 10) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Submit 10 reports to unlock premium rewards
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full">
          Redeem Points
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardPointsCard;
