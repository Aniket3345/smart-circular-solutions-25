import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { isAuthenticated, getCurrentUser, logout, addRewardPoints } from '@/utils/auth';
import FloodReport from '@/components/flood/FloodReport';
import FloodReportsList from '@/components/flood/FloodReportsList';
import FloodInfoSidebar from '@/components/flood/FloodInfoSidebar';

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

const Flood = () => {
  const navigate = useNavigate();
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
    const items = localStorage.getItem('reported_flood_items');
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
    floodType: string;
    location: { address: string; latitude: number; longitude: number };
    comment: string;
  }) => {
    setIsSubmitting(true);
    
    // Create new report item
    const newItem: ReportedItem = {
      id: 'flood_' + Date.now().toString(),
      image: data.image,
      floodType: data.floodType,
      location: data.location,
      comment: data.comment,
      timestamp: new Date().toISOString(),
      points: 15
    };
    
    // Update reported items
    const updatedItems = [newItem, ...reportedItems];
    setReportedItems(updatedItems);
    localStorage.setItem('reported_flood_items', JSON.stringify(updatedItems));
    
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
    toast.open({
      title: 'Flood report submitted successfully!',
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
            <h1 className="text-3xl font-bold mb-2">Flood Reporting</h1>
            <p className="text-muted-foreground">
              Report and track flooding in your area to help authorities respond effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Report form */}
            <div className="lg:col-span-2 space-y-6" id="flood-report">
              <FloodReport onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              
              {/* Recent activity */}
              <FloodReportsList reports={reportedItems} />
            </div>
            
            {/* Right column - Information */}
            <div>
              <FloodInfoSidebar hasReports={reportedItems.length > 0} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flood;
