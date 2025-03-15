import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { isAuthenticated, getCurrentUser, logout, updateUser } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Award, Edit, Save, Trash2, MapPin, Calendar, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pincode: '',
    address: '',
  });
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
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      pincode: currentUser?.pincode || '',
      address: currentUser?.address || '',
    });

    // Load reports from localStorage
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateUser({
        name: formData.name,
        pincode: formData.pincode,
        address: formData.address,
      });
      setUser(updatedUser);
      setIsEditing(false);
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile information has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: 'An error occurred while updating your profile.',
        variant: 'destructive',
      });
    }
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Profile</CardTitle>
                    {!isEditing ? (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarFallback className="text-2xl">
                          {getInitials(user?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      <div className="w-full space-y-2 pt-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">{user?.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Pincode</p>
                            <p className="text-sm text-muted-foreground">{user?.pincode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="bg-secondary/30"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Reward Points Card */}
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
                        <span className="font-medium">{getTotalReports()}</span>
                      </div>
                      <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${Math.min((getTotalReports() / 10) * 100, 100)}%` }}
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
            </div>

            {/* Tabs for Reports */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Reports</CardTitle>
                  <CardDescription>
                    All reports you've submitted across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="waste">Waste</TabsTrigger>
                      <TabsTrigger value="flood">Flood</TabsTrigger>
                      <TabsTrigger value="electricity">Electricity</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-6">
                      {getTotalReports() === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">You haven't submitted any reports yet</p>
                          <Button className="mt-4" onClick={() => navigate('/waste')}>
                            Make Your First Report
                          </Button>
                        </div>
                      ) : (
                        <>
                          {wasteReports.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium mb-3">Waste Reports</h3>
                              {wasteReports.map(report => (
                                <div key={report.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg mb-3">
                                  <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                                    <img src={report.image} alt="Waste" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{report.wasteType}</h4>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => deleteReport('waste', report.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {report.location.address}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(report.timestamp)}
                                    </div>
                                    <div className="mt-2 text-xs font-medium text-primary">
                                      +{report.points} points
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {floodReports.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium mb-3">Flood Reports</h3>
                              {floodReports.map(report => (
                                <div key={report.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg mb-3">
                                  <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                                    <img src={report.image} alt="Flood" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{report.floodType}</h4>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => deleteReport('flood', report.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {report.location.address}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(report.timestamp)}
                                    </div>
                                    <div className="mt-2 text-xs font-medium text-flood">
                                      +{report.points} points
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {electricityReports.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium mb-3">Electricity Reports</h3>
                              {electricityReports.map(report => (
                                <div key={report.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg mb-3">
                                  <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                                    <img src={report.image} alt="Electricity" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{report.issueType}</h4>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => deleteReport('electricity', report.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {report.location.address}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(report.timestamp)}
                                    </div>
                                    <div className="mt-2 text-xs font-medium text-energy">
                                      +{report.points} points
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="waste" className="space-y-4">
                      {wasteReports.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No waste reports yet</p>
                          <Button className="mt-4" onClick={() => navigate('/waste')}>
                            Report Waste
                          </Button>
                        </div>
                      ) : (
                        wasteReports.map(report => (
                          <div key={report.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg">
                            <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                              <img src={report.image} alt="Waste" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{report.wasteType}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => deleteReport('waste', report.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {report.location.address}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(report.timestamp)}
                              </div>
                              <div className="mt-2 text-xs font-medium text-primary">
                                +{report.points} points
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="flood" className="space-y-4">
                      {floodReports.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No flood reports yet</p>
                          <Button className="mt-4" onClick={() => navigate('/flood')}>
                            Report Flooding
                          </Button>
                        </div>
                      ) : (
                        floodReports.map(report => (
                          <div key={report.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg">
                            <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                              <img src={report.image} alt="Flood" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{report.floodType}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => deleteReport('flood', report.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {report.location.address}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(report.timestamp)}
                              </div>
                              <div className="mt-2 text-xs font-medium text-flood">
                                +{report.points} points
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="electricity" className="space-y-4">
                      {electricityReports.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No electricity reports yet</p>
                          <Button className="mt-4" onClick={() => navigate('/electricity')}>
                            Report Electricity Issues
                          </Button>
                        </div>
                      ) : (
                        electricityReports.map(report => (
                          <div key={report.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg">
                            <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                              <img src={report.image} alt="Electricity" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{report.issueType}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => deleteReport('electricity', report.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {report.location.address}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(report.timestamp)}
                              </div>
                              <div className="mt-2 text-xs font-medium text-energy">
                                +{report.points} points
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
