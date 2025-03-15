import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import LocationPicker from '@/components/LocationPicker';
import InfoCard from '@/components/InfoCard';
import { Zap, AlertTriangle, Check, Frown, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated, getCurrentUser, logout, addRewardPoints } from '@/utils/auth';

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
  const [image, setImage] = useState<string | null>(null);
  const [issueType, setIssueType] = useState<string | null>(null);
  const [location, setLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  const [comment, setComment] = useState('');
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

  const handleImageProcessed = (imageUrl: string, type: string) => {
    setImage(imageUrl);
    setIssueType(type);
  };

  const handleLocationSelected = (loc: { address: string; latitude: number; longitude: number }) => {
    setLocation(loc);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!image || !issueType || !location) {
      toast({
        title: 'Missing information',
        description: 'Please provide all required information before submitting.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new report item
    const newItem: ReportedItem = {
      id: 'electricity_' + Date.now().toString(),
      image,
      issueType,
      location,
      comment,
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
    
    // Reset form
    setImage(null);
    setIssueType(null);
    setLocation(null);
    setComment('');
    setIsSubmitting(false);
  };

  const getElectricityRecommendations = (type: string): string[] => {
    const recommendations: Record<string, string[]> = {
      'Electricity issue identified': [
        'Stay away from fallen power lines',
        'Report the issue to your electricity provider',
        'Turn off appliances during power outages',
        'Use flashlights instead of candles during outages'
      ],
      'Power outage': [
        'Keep refrigerator and freezer doors closed',
        'Unplug electronic devices to protect from surges',
        'Check if neighbors are also affected',
        'Contact electricity provider for estimated restoration time'
      ],
      'Damaged infrastructure': [
        'Do not approach damaged electrical equipment',
        'Keep a safe distance from fallen power lines',
        'Report immediately to emergency services',
        'Warn others to stay away from the area'
      ]
    };
    
    return recommendations[type] || [
      'Report the issue to your electricity provider',
      'Follow safety guidelines for electrical issues',
      'Keep emergency contact numbers handy',
      'Use battery-powered devices during outages'
    ];
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
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Report Electricity Issue</CardTitle>
                  <CardDescription>
                    Upload a photo of electrical problems to help utilities address them quickly
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ImageUploader onImageProcessed={handleImageProcessed} type="electricity" />
                  
                  {issueType && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-secondary border">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-yellow-100 text-yellow-600">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium mb-1">Identified as: {issueType}</div>
                            <p className="text-sm text-muted-foreground">
                              This appears to be an electricity issue. Your report will help utilities respond effectively.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommendations:</h3>
                        <ul className="space-y-2">
                          {getElectricityRecommendations(issueType).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-primary mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {image && (
                    <>
                      <Separator />
                      
                      <LocationPicker onLocationSelected={handleLocationSelected} />
                      
                      <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium">
                          Additional Comments
                        </label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={handleCommentChange}
                          placeholder="Add any details about the electricity issue that might be helpful..."
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                
                {image && issueType && location && (
                  <CardFooter className="border-t bg-secondary/20 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Submit this report to earn 12 points
                    </div>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                    >
                      Submit Report
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {/* Recent activity */}
              {reportedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Recent Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportedItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt="Reported electricity issue" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.issueType}</div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {item.location.address}
                            </div>
                            {item.comment && (
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {item.comment.length > 50 ? item.comment.substring(0, 50) + '...' : item.comment}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                            <div className="text-xs font-medium text-energy">
                              +{item.points} points
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right column - Information */}
            <div className="space-y-6">
              <InfoCard
                title="About Energy Issues"
                description="Mumbai faces regular power outages affecting millions of residents and businesses."
                icon={Zap}
                color="energy"
              >
                <div className="space-y-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    Quick reporting of electricity issues helps utilities pinpoint problems and restore power faster.
                    By reporting outages and damaged infrastructure, you help create a more reliable energy grid for Mumbai.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <div className="text-2xl font-bold text-energy">350+</div>
                      <div className="text-xs text-muted-foreground">Monthly outages</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <div className="text-2xl font-bold text-energy">2.5 hrs</div>
                      <div className="text-xs text-muted-foreground">Avg. restoration time</div>
                    </div>
                  </div>
                </div>
              </InfoCard>
              
              <InfoCard
                title="How You Can Help"
                description="Your electricity issue reports make a real difference to Mumbai's power grid."
                icon={AlertTriangle}
                color="energy"
              >
                <ul className="space-y-2 mt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-energy mt-0.5" />
                    <span>Report power outages immediately</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-energy mt-0.5" />
                    <span>Document damaged electrical infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-energy mt-0.5" />
                    <span>Note how widespread the outage is</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-energy mt-0.5" />
                    <span>Add exact location details</span>
                  </li>
                </ul>
              </InfoCard>
              
              {reportedItems.length === 0 && (
                <InfoCard
                  title="No Reports Yet"
                  description="You haven't submitted any electricity issue reports yet."
                  icon={Frown}
                  color="primary"
                >
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Start by uploading a photo of an electricity issue using the form. Your reports help
                      create a more reliable energy grid for Mumbai.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => document.getElementById('electricity-report')?.scrollIntoView({ behavior: 'smooth' })}>
                      Make Your First Report
                    </Button>
                  </div>
                </InfoCard>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Electricity;
