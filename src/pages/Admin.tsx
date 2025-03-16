import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  User,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  Report,
  getAllReports,
  updateReportStatus,
  getUserById
} from '@/utils/auth';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Check, 
  X, 
  User as UserIcon, 
  Image, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileImage,
  Filter,
  Layers
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const navigate = useNavigate();
  const { open } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      open({
        title: "Authentication required",
        description: "Please login to access admin page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Check if current user has admin access
    const currentUser = getCurrentUser();
    if (!currentUser || !isAdmin()) {
      open({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Fetch all users and reports
    try {
      const allUsers = getAllUsers();
      const allReports = getAllReports();
      setUsers(allUsers);
      setReports(allReports);
    } catch (error) {
      console.error('Error fetching data:', error);
      open({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, open]);

  const handleApproveReport = (reportId: string) => {
    const success = updateReportStatus(reportId, 'approved');
    if (success) {
      open({
        title: "Report approved",
        description: "User has been awarded 10 points.",
      });
      
      // Refresh reports list
      setReports(getAllReports());
      
      // Refresh user list to update points
      setUsers(getAllUsers());
    }
  };

  const handleRejectReport = (reportId: string) => {
    const success = updateReportStatus(reportId, 'rejected');
    if (success) {
      open({
        title: "Report rejected",
        description: "No points have been awarded.",
      });
      
      // Refresh reports list
      setReports(getAllReports());
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const filteredReports = filterType 
    ? reports.filter(report => report.type === filterType)
    : reports;
  
  const reportsByType = {
    waste: reports.filter(report => report.type === 'waste').length,
    flood: reports.filter(report => report.type === 'flood').length,
    electricity: reports.filter(report => report.type === 'electricity').length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data...</p>
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="default" onClick={() => navigate('/profile')}>
            My Profile
          </Button>
        </div>
      </header>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Database</CardTitle>
              <CardDescription>Manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No users registered yet.</p>
              ) : (
                <Table>
                  <TableCaption>List of all registered users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Reward Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.pincode || '-'}</TableCell>
                        <TableCell>{user.address || '-'}</TableCell>
                        <TableCell>{user.role || 'user'}</TableCell>
                        <TableCell className="text-right">{user.rewardPoints}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Review and approve reports submitted by users</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No reports submitted yet.</p>
              ) : (
                <Table>
                  <TableCaption>List of all submitted reports</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          {getUserName(report.userId)}
                        </TableCell>
                        <TableCell className="capitalize">{report.type}</TableCell>
                        <TableCell>{report.description || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.status === 'pending' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : report.status === 'approved' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {report.imageUrl ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Image className="h-4 w-4" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Report Image</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <img 
                                    src={report.imageUrl} 
                                    alt="Report" 
                                    className="w-full h-auto rounded-md object-cover max-h-[500px]" 
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-muted-foreground text-sm">No image</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {report.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleApproveReport(report.id)}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleRejectReport(report.id)}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Uploaded Photos Gallery</CardTitle>
                <CardDescription>View all uploaded photos from reports</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${!filterType ? 'bg-primary/10' : ''}`}
                  onClick={() => setFilterType(null)}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  All ({reports.length})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${filterType === 'waste' ? 'bg-primary/10' : ''}`}
                  onClick={() => setFilterType('waste')}
                >
                  Waste ({reportsByType.waste})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${filterType === 'flood' ? 'bg-primary/10' : ''}`}
                  onClick={() => setFilterType('flood')}
                >
                  Flood ({reportsByType.flood})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${filterType === 'electricity' ? 'bg-primary/10' : ''}`}
                  onClick={() => setFilterType('electricity')}
                >
                  Electricity ({reportsByType.electricity})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-center py-10">
                  <FileImage className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No photos available</p>
                  {filterType && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Try selecting a different filter or view all photos
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredReports.filter(report => report.imageUrl).map((report) => (
                      <Dialog key={report.id}>
                        <DialogTrigger asChild>
                          <div className="overflow-hidden rounded-md border cursor-pointer hover:opacity-90 transition-opacity">
                            <div className="relative">
                              <AspectRatio ratio={1 / 1} className="bg-muted">
                                <img
                                  src={report.imageUrl || ""}
                                  alt={`Report: ${report.type}`}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </AspectRatio>
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-white capitalize">
                                    {report.type}
                                  </span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    report.status === 'approved' 
                                      ? 'bg-green-500/80 text-white' 
                                      : report.status === 'rejected'
                                      ? 'bg-red-500/80 text-white'
                                      : 'bg-yellow-500/80 text-white'
                                  }`}>
                                    {report.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span className="capitalize">{report.type}</span> Report
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                report.status === 'approved' 
                                  ? 'bg-green-500 text-white' 
                                  : report.status === 'rejected'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-yellow-500 text-white'
                              }`}>
                                {report.status}
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="aspect-video relative">
                              <img 
                                src={report.imageUrl} 
                                alt={`${report.type} report`} 
                                className="object-contain w-full h-full rounded-md border"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">User</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <UserIcon className="h-3 w-3" />
                                  {getUserName(report.userId)}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Submitted</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            {report.description && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/50">
                                  {report.description}
                                </p>
                              </div>
                            )}
                            {report.status === 'pending' && (
                              <div className="flex gap-2 justify-end mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => handleApproveReport(report.id)}
                                >
                                  <Check className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleRejectReport(report.id)}
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>

                  {filteredReports.filter(report => !report.imageUrl).length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Reports without images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredReports.filter(report => !report.imageUrl).map((report) => (
                          <div key={report.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="capitalize font-medium">{report.type}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                report.status === 'approved' 
                                  ? 'bg-green-500 text-white' 
                                  : report.status === 'rejected'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-yellow-500 text-white'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {report.description || "No description provided"}
                            </p>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
