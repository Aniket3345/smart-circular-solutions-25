
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import LocationPicker from '@/components/LocationPicker';
import InfoCard from '@/components/InfoCard';
import { CloudRain, AlertTriangle, Check, Frown, MapPin, MessageSquare } from 'lucide-react';
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
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [image, setImage] = useState<string | null>(null);
  const [floodType, setFloodType] = useState<string | null>(null);
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
    const items = localStorage.getItem('reported_flood_items');
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
    setFloodType(type);
  };

  const handleLocationSelected = (loc: { address: string; latitude: number; longitude: number }) => {
    setLocation(loc);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (!image || !floodType || !location) {
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
      id: 'flood_' + Date.now().toString(),
      image,
      floodType,
      location,
      comment,
      timestamp: new Date().toISOString(),
      points: 15
    };
    
    // Update reported items
    const updatedItems = [newItem, ...reportedItems];
    setReportedItems(updatedItems);
    localStorage.setItem('reported_flood_items', JSON.stringify(updatedItems));
    
    // Award points to user
    if (user) {
      const updatedUser = addRewardPoints(newItem.points);
      setUser(updatedUser);
    }
    
    // Show success toast
    toast({
      title: 'Flood report submitted successfully!',
      description: `You earned ${newItem.points} points for your contribution.`,
      variant: 'default',
    });
    
    // Reset form
    setImage(null);
    setFloodType(null);
    setLocation(null);
    setComment('');
    setIsSubmitting(false);
  };

  const getFloodRecommendations = (type: string): string[] => {
    const recommendations: Record<string, string[]> = {
      'Flood area identified': [
        'Stay away from flooded areas',
        'Do not attempt to walk or drive through flooded areas',
        'Move to higher ground if in danger',
        'Follow instructions from local authorities'
      ],
      'Minor flooding': [
        'Avoid walking through moving water',
        'Be prepared to evacuate if necessary',
        'Keep important documents in waterproof containers',
        'Turn off electricity if water has entered your home'
      ],
      'Severe flooding': [
        'Evacuate immediately if instructed',
        'Do not touch electrical equipment if wet',
        'Avoid contact with flood water as it may be contaminated',
        'Report broken utility lines to authorities'
      ]
    };
    
    return recommendations[type] || [
      'Report the flood to local authorities',
      'Stay informed about weather updates',
      'Prepare an emergency kit',
      'Follow evacuation routes if necessary'
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
            <h1 className="text-3xl font-bold mb-2">Flood Reporting</h1>
            <p className="text-muted-foreground">
              Report and track flooding in your area to help authorities respond effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Report form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Report Flooding</CardTitle>
                  <CardDescription>
                    Upload a photo of flooding to help authorities assess the situation
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ImageUploader onImageProcessed={handleImageProcessed} type="flood" />
                  
                  {floodType && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-secondary border">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-blue-100 text-blue-600">
                            <CloudRain className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium mb-1">Identified as: {floodType}</div>
                            <p className="text-sm text-muted-foreground">
                              This looks like a flood-affected area. Your report will help authorities respond.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommendations:</h3>
                        <ul className="space-y-2">
                          {getFloodRecommendations(floodType).map((rec, index) => (
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
                          placeholder="Add any details about the flooding or location that might be helpful..."
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                
                {image && floodType && location && (
                  <CardFooter className="border-t bg-secondary/20 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Submit this report to earn 15 points
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
                              alt="Reported flood" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.floodType}</div>
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
                            <div className="text-xs font-medium text-flood">
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
                title="About Flood Reporting"
                description="Mumbai faces significant flooding during monsoon seasons, affecting millions of residents."
                icon={CloudRain}
                color="flood"
              >
                <div className="space-y-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    Timely flood reporting helps authorities respond quickly to affected areas, 
                    potentially saving lives and reducing property damage. By reporting flooding, 
                    you help create a real-time map of affected areas in Mumbai.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <div className="text-2xl font-bold text-flood">60%</div>
                      <div className="text-xs text-muted-foreground">Of Mumbai at risk</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <div className="text-2xl font-bold text-flood">2,000+</div>
                      <div className="text-xs text-muted-foreground">Reports last monsoon</div>
                    </div>
                  </div>
                </div>
              </InfoCard>
              
              <InfoCard
                title="How You Can Help"
                description="Your contributions can make a difference during flooding events."
                icon={AlertTriangle}
                color="flood"
              >
                <ul className="space-y-2 mt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-flood mt-0.5" />
                    <span>Report flooding with precise location</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-flood mt-0.5" />
                    <span>Upload clear photos of flooding</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-flood mt-0.5" />
                    <span>Add details about water levels</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-flood mt-0.5" />
                    <span>Share emergency contact information</span>
                  </li>
                </ul>
              </InfoCard>
              
              {reportedItems.length === 0 && (
                <InfoCard
                  title="No Reports Yet"
                  description="You haven't submitted any flood reports yet."
                  icon={Frown}
                  color="primary"
                >
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Start by uploading a photo of flooding using the form. Your reports help 
                      create a real-time map of flood-affected areas in Mumbai.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => document.getElementById('flood-report')?.scrollIntoView({ behavior: 'smooth' })}>
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

export default Flood;
