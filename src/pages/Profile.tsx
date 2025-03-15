
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { isAuthenticated, getCurrentUser, logout, User } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import UserProfileCard from '@/components/profile/UserProfileCard';
import RewardPointsCard from '@/components/profile/RewardPointsCard';
import UserReportsTabs from '@/components/profile/UserReportsTabs';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [wasteReports, setWasteReports] = useState<any[]>([]);
  const [floodReports, setFloodReports] = useState<any[]>([]);
  const [electricityReports, setElectricityReports] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);

    const wasteItems = localStorage.getItem('reported_waste_items');
    if (wasteItems) setWasteReports(JSON.parse(wasteItems));

    const floodItems = localStorage.getItem('reported_flood_items');
    if (floodItems) setFloodReports(JSON.parse(floodItems));

    const electricityItems = localStorage.getItem('reported_electricity_items');
    if (electricityItems) setElectricityReports(JSON.parse(electricityItems));
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTotalReports = () => {
    return wasteReports.length + floodReports.length + electricityReports.length;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const deleteReport = (reportType: string, reportId: string) => {
    let storageKey: string;
    let reportArray: any[];
    let setReportArray: React.Dispatch<React.SetStateAction<any[]>>;

    switch (reportType) {
      case 'waste':
        storageKey = 'reported_waste_items';
        reportArray = wasteReports;
        setReportArray = setWasteReports;
        break;
      case 'flood':
        storageKey = 'reported_flood_items';
        reportArray = floodReports;
        setReportArray = setFloodReports;
        break;
      case 'electricity':
        storageKey = 'reported_electricity_items';
        reportArray = electricityReports;
        setReportArray = setElectricityReports;
        break;
      default:
        return;
    }

    const updatedReports = reportArray.filter(report => report.id !== reportId);
    setReportArray(updatedReports);
    localStorage.setItem(storageKey, JSON.stringify(updatedReports));

    toast({
      title: 'Report deleted',
      description: 'The report has been deleted successfully.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={true}
        userPoints={user?.rewardPoints || 0}
        userName={user?.name || ''}
        onLogout={handleLogout}
      />

      <main className="flex-1 pt-20">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <UserProfileCard user={user} setUser={setUser} />
              <RewardPointsCard user={user} totalReports={getTotalReports()} />
            </div>

            <div className="lg:col-span-2">
              <UserReportsTabs
                wasteReports={wasteReports}
                floodReports={floodReports}
                electricityReports={electricityReports}
                formatDate={formatDate}
                deleteReport={deleteReport}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
