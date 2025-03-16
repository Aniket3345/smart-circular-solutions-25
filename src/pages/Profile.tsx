
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserProfileCard from "@/components/profile/UserProfileCard";
import RewardPointsCard from "@/components/profile/RewardPointsCard";
import UserReportsTabs from "@/components/profile/UserReportsTabs";
import { getCurrentUser, User, isAuthenticated, getUserReports } from "@/utils/auth";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userReports, setUserReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.open({
        title: "Authentication required",
        description: "Please login to view your profile.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        // Get current user data
        const userData = getCurrentUser();
        if (userData) {
          setUser(userData);
          
          // Get user reports
          if (userData.id) {
            const reports = await getUserReports(userData.id);
            // Format reports for the UI
            const formattedReports = reports.map(report => ({
              id: report.id,
              title: `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} issue reported`,
              location: report.location?.address || "Unknown location",
              date: new Date(report.timestamp).toISOString().split('T')[0],
              category: report.type,
              image: report.imageUrl || "",
              description: report.description
            }));
            setUserReports(formattedReports);
          }
        } else {
          toast.open({
            title: "Error loading profile",
            description: "Unable to load user data. Please try logging in again.",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.open({
          title: "Error",
          description: "Something went wrong while loading your profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  // If user data is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>User Profile | Smart Circular</title>
      </Helmet>
      
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <UserProfileCard user={user} setUser={setUser} />
        <RewardPointsCard points={user?.rewardPoints || 0} totalReports={userReports.length} />
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Reports</h2>
        <UserReportsTabs 
          wasteReports={userReports.filter(r => r.category === 'waste')}
          floodReports={userReports.filter(r => r.category === 'flood')}
          electricityReports={userReports.filter(r => r.category === 'electricity')}
          formatDate={(date) => new Date(date).toLocaleDateString()}
          deleteReport={() => {}} // Placeholder for delete functionality
        />
      </Card>
    </div>
  );
};

export default Profile;
