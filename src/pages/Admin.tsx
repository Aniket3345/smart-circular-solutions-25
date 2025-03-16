
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Calendar, Check, X } from 'lucide-react';
import { isAuthenticated, isAdmin, getAllReports, getAllUsers, updateReportStatus } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated()) {
      toast.open({
        title: "Authentication required",
        description: "Please login to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!isAdmin()) {
      toast.open({
        title: "Access denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all reports
        const allReports = await getAllReports();
        console.log("Loaded all reports:", allReports);
        
        // Format reports for UI
        const formattedReports = allReports.map(report => ({
          id: report.id,
          userId: report.userId,
          type: report.type,
          description: report.description,
          imageUrl: report.imageUrl,
          status: report.status,
          timestamp: report.timestamp,
          location: report.location,
          date: new Date(report.timestamp).toLocaleDateString()
        }));
        
        setReports(formattedReports);
        setFilteredReports(formattedReports);
        
        // Load all users
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.open({
          title: "Error",
          description: "Failed to load administrative data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Filter reports by type and status
  const filterReports = (filter: string) => {
    setCurrentFilter(filter);
    
    if (filter === 'all') {
      setFilteredReports(reports);
    } else if (['waste', 'flood', 'electricity'].includes(filter)) {
      setFilteredReports(reports.filter(report => report.type === filter));
    } else if (['pending', 'approved', 'rejected'].includes(filter)) {
      setFilteredReports(reports.filter(report => report.status === filter));
    }
  };

  // Handle report approval/rejection
  const handleUpdateStatus = async (reportId: string, status: 'approved' | 'rejected') => {
    try {
      const success = await updateReportStatus(reportId, status);
      
      if (success) {
        // Update local state
        setReports(prev => prev.map(report => 
          report.id === reportId ? { ...report, status } : report
        ));
        
        setFilteredReports(prev => prev.map(report => 
          report.id === reportId ? { ...report, status } : report
        ));
        
        toast.open({
          title: `Report ${status}`,
          description: `The report has been ${status} successfully.`,
        });
      } else {
        toast.open({
          title: "Action failed",
          description: "Failed to update report status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.open({
        title: "Error",
        description: "An error occurred while updating the report.",
        variant: "destructive",
      });
    }
  };

  // Get user name from userId
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading administrative data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Dashboard | Smart Circular</title>
      </Helmet>
      
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reports.filter(r => r.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Reports</CardTitle>
          <CardDescription>
            View and manage all user reports across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <TabsList className="w-full grid grid-cols-7">
              <TabsTrigger 
                value="all" 
                onClick={() => filterReports('all')}
                data-state={currentFilter === 'all' ? 'active' : ''}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="waste" 
                onClick={() => filterReports('waste')}
                data-state={currentFilter === 'waste' ? 'active' : ''}
              >
                Waste
              </TabsTrigger>
              <TabsTrigger 
                value="flood" 
                onClick={() => filterReports('flood')}
                data-state={currentFilter === 'flood' ? 'active' : ''}
              >
                Flood
              </TabsTrigger>
              <TabsTrigger 
                value="electricity" 
                onClick={() => filterReports('electricity')}
                data-state={currentFilter === 'electricity' ? 'active' : ''}
              >
                Electricity
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                onClick={() => filterReports('pending')}
                data-state={currentFilter === 'pending' ? 'active' : ''}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                onClick={() => filterReports('approved')}
                data-state={currentFilter === 'approved' ? 'active' : ''}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                onClick={() => filterReports('rejected')}
                data-state={currentFilter === 'rejected' ? 'active' : ''}
              >
                Rejected
              </TabsTrigger>
            </TabsList>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reports found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map(report => (
                <div key={report.id} className="border rounded-lg overflow-hidden bg-card">
                  <div className="flex flex-col md:flex-row">
                    {report.imageUrl && (
                      <div className="md:w-1/4 h-48 md:h-auto">
                        <img 
                          src={report.imageUrl} 
                          alt={report.type}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reported by: {getUserName(report.userId)}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : report.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                      </div>
                      
                      <p className="mt-2">{report.description}</p>
                      
                      <div className="flex flex-wrap items-center mt-4 gap-4">
                        {report.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {report.location.address}
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {report.date}
                        </div>
                      </div>
                      
                      {report.status === 'pending' && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(report.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(report.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
