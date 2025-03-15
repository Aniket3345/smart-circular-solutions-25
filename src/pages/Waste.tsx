import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import LocationPicker from '@/components/LocationPicker';
import InfoCard from '@/components/InfoCard';
import { Recycle, Leaf, AlertTriangle, Check, Frown, MapPin, MessageSquare } from 'lucide-react';
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
import { isRecyclable, getWasteRecommendations, WasteType } from '@/utils/imageRecognition';

interface ReportedItem {
  id: string;
  image: string;
  wasteType: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  comment: string;
  timestamp: string;
  points: number;
}

const Waste = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [image, setImage] = useState<string | null>(null);
  const [wasteType, setWasteType] = useState<WasteType | null>(null);
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
    
    const items = localStorage.getItem('reported_waste_items');
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
    setWasteType(type as WasteType);
  };

  const handleLocationSelected = (loc: { address: string; latitude: number; longitude: number }) => {
    setLocation(loc);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!image || !wasteType || !location) {
      toast({
        title: 'Missing information',
        description: 'Please provide all required information before submitting.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const newItem: ReportedItem = {
      id: 'waste_' + Date.now().toString(),
      image,
      wasteType,
      location,
      comment,
      timestamp: new Date().toISOString(),
      points: 10
    };
    
    const updatedItems = [newItem, ...reportedItems];
    setReportedItems(updatedItems);
    localStorage.setItem('reported_waste_items', JSON.stringify(updatedItems));
    
    if (user) {
      try {
        const updatedUser = await addRewardPoints(newItem.points);
        setUser(updatedUser);
      } catch (error) {
        console.error('Failed to add reward points:', error);
      }
    }
    
    toast({
      title: 'Report submitted successfully!',
      description: `You earned ${newItem.points} points for your contribution.`,
      variant: 'default',
    });
    
    setImage(null);
    setWasteType(null);
    setLocation(null);
    setComment('');
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
            <h1 className="text-3xl font-bold mb-2">Waste Management</h1>
            <p className="text-muted-foreground">
              Help identify and properly dispose of waste in your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Report Waste</CardTitle>
                  <CardDescription>
                    Upload a photo of waste to identify its type and make a report
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ImageUploader onImageProcessed={handleImageProcessed} type="waste" />
                  
                  {wasteType && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-secondary border">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                            isRecyclable(wasteType) ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {isRecyclable(wasteType) ? <Recycle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium mb-1">Identified as: {wasteType}</div>
                            <p className="text-sm text-muted-foreground">
                              {isRecyclable(wasteType) 
                                ? 'This waste can be recycled. Please follow the guidelines for proper disposal.'
                                : 'This waste requires special handling. Please follow local regulations for proper disposal.'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommendations:</h3>
                        <ul className="space-y-2">
                          {getWasteRecommendations(wasteType).map((rec, index) => (
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
                          placeholder="Add any details about the waste or location that might be helpful..."
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                
                {image && wasteType && location && (
                  <CardFooter className="border-t bg-secondary/20 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Submit this report to earn 10 points
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
                              alt="Reported waste" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.wasteType}</div>
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
                            <div className="text-xs font-medium text-primary">
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
            
            <div className="space-y-6">
              <InfoCard
                title="About Waste Management"
                description="Mumbai generates over 7,500 tons of waste daily, with 40% left unprocessed."
                icon={Leaf}
                color="waste"
              >
                <div className="space-y-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    Improper waste disposal leads to clogged drains, worsened flooding, and 
                    pollution of water bodies. By correctly identifying and disposing of waste, 
                    you can help create a cleaner Mumbai.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <div className="text-2xl font-bold text-waste">40%</div>
                      <div className="text-xs text-muted-foreground">Waste unprocessed</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <div className="text-2xl font-bold text-waste">7,500</div>
                      <div className="text-xs text-muted-foreground">Tons generated daily</div>
                    </div>
                  </div>
                </div>
              </InfoCard>
              
              <InfoCard
                title="How You Can Help"
                description="Your contributions make a real difference to Mumbai's waste crisis."
                icon={Recycle}
                color="waste"
              >
                <ul className="space-y-2 mt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-waste mt-0.5" />
                    <span>Report waste in your area with photos</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-waste mt-0.5" />
                    <span>Learn about proper waste segregation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-waste mt-0.5" />
                    <span>Earn rewards for responsible disposal</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-waste mt-0.5" />
                    <span>Organize community cleanup drives</span>
                  </li>
                </ul>
              </InfoCard>
              
              {reportedItems.length === 0 && (
                <InfoCard
                  title="No Reports Yet"
                  description="You haven't submitted any waste reports yet."
                  icon={Frown}
                  color="primary"
                >
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Start by uploading a photo of waste using the form. We'll help identify 
                      the type and recommend proper disposal methods.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => document.getElementById('waste-report')?.scrollIntoView({ behavior: 'smooth' })}>
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

export default Waste;
