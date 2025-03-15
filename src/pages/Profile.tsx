
import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { RewardPointsCard } from "@/components/profile/RewardPointsCard";
import { UserReportsTabs } from "@/components/profile/UserReportsTabs";

const Profile = () => {
  const navigate = useNavigate();

  // Sample user data - in a real app, this would come from your auth context or API
  const userData = {
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    location: "Mumbai, India",
    pincode: "400001",
    address: "123 Marine Drive, Mumbai",
    rewardPoints: 125,
    totalReports: 7
  };

  // Sample reports data - in a real app, this would come from an API
  const reportsData = [
    {
      id: 1,
      title: "Garbage pile on Marine Drive",
      location: "Marine Drive, Mumbai",
      date: "2023-12-10",
      category: "waste",
      image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyYmFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Street flooding near railway station",
      location: "Dadar, Mumbai",
      date: "2024-01-15",
      category: "flood",
      image: "https://images.unsplash.com/photo-1613559806609-790411b0cea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Power line down after storm",
      location: "Bandra, Mumbai",
      date: "2024-02-20",
      category: "electricity",
      image: "https://images.unsplash.com/photo-1621954809142-7c5c73da001c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG93ZXIlMjBsaW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    // ... more reports
  ];

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
        <UserProfileCard user={userData} />
        <RewardPointsCard points={userData.rewardPoints} reports={userData.totalReports} />
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Reports</h2>
        <UserReportsTabs reports={reportsData} />
      </Card>
    </div>
  );
};

export default Profile;
