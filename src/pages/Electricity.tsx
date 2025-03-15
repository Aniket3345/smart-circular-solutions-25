
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated, getCurrentUser, logout, addRewardPoints } from '@/utils/auth';
import ElectricityReport from '@/components/electricity/ElectricityReport';
import ElectricityReportsList from '@/components/electricity/ElectricityReportsList';
import ElectricityInfoSidebar from '@/components/electricity/ElectricityInfoSidebar';

interface ReportedItem {
  id: string;
  image: string;
  issueType: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  comment: string;
  timestamp: string;
  points: number;
}

const Electricity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    if (!authStatus) {
      navigate('/login');
      return;
    }
    
    setUser(getCurrentUser());
    
    // Load reported items from localStorage
    const items = localStorage.getItem('reported_electricity_items');
    if (items) {
      setReportedItems(JSON.parse(items));
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (data: {
    image: string;
    issueType: string;
    location: { address: string; latitude: number; longitude: number };
    comment: string;
  }) => {
    setIsSubmitting(true);
    
    // Create new report item
    const newItem: ReportedItem = {
      id: 'electricity_' + Date.now().toString(),
      image: data.image,
      issueType: data.issueType,
      location: data.location,
      comment: data.comment,
      timestamp: new Date().toISOString(),
      points: 12
    };
    
    // Update reported items
    const updatedItems = [newItem, ...reportedItems];
    setReportedItems(updatedItems);
    localStorage.setItem('reported_electricity_items', JSON.stringify(updatedItems));
    
    // Award points to user
    if (user) {
      try {
        const updatedUser = await addRewardPoints(newItem.points);
        setUser(updatedUser);
      } catch (error) {
        console.error('Failed to add reward points:', error);
      }
    }
    
    // Show success toast
    toast({
      title: 'Electricity issue reported successfully!',
      description: `You earned ${newItem.points} points for your contribution.`,
      variant: 'default',
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAuthenticated={authenticated} 
        userPoints={user?.rewardPoints || 0}
        userName={user?.name || ''}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 pt-20">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Electricity Issues</h1>
            <p className="text-muted-foreground">
              Report electricity problems and outages in your community for faster resolution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Report form */}
            <div className="lg:col-span-2 space-y-6">
              <ElectricityReport onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              
              {/* Recent activity */}
              <ElectricityReportsList reports={reportedItems} />
            </div>
            
            {/* Right column - Information */}
            <div>
              <ElectricityInfoSidebar hasReports={reportedItems.length > 0} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Electricity;
