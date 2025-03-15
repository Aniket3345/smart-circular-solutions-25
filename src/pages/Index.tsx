
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight, Users, Award, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from '@/utils/auth';
import { User } from '@/utils/auth';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    if (authStatus) {
      const userData = getCurrentUser();
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
  };

  // Mock stats data
  const stats = [
    { label: 'Active Contributors', value: '2,514', icon: Users },
    { label: 'Issues Reported', value: '18,721', icon: MapPin },
    { label: 'Points Redeemed', value: '126,500', icon: Award },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isAuthenticated={authenticated} 
        userPoints={user?.rewardPoints || 0}
        userName={user?.name || ''}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        <Hero />
        
        {/* Stats Section */}
        <section className="bg-secondary/30 py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Impact</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Together, we're building a more sustainable Mumbai through community-driven action and innovation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="glass-card hover:scale-[1.02] transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-8 w-8 text-primary/70" />
                        <span className="text-3xl font-bold">{stat.value}</span>
                      </div>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
                  <span>Our Mission</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Tackling Mumbai's Sustainability Challenges
                </h2>
                <p className="text-muted-foreground mb-6">
                  Mumbai generates over 7,500 metric tons of waste daily, with 40% unprocessed, 
                  clogging drains and worsening monsoon floods that displace 1,000+ families annually. 
                  Simultaneously, 30% of slum households lack reliable electricity, relying on polluting 
                  diesel generators, while coastal erosion destroys critical mangrove ecosystems that 
                  act as natural flood barriers.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-waste/10 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-waste" />
                    </div>
                    <p>Improve waste management through community reporting and smart sorting</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-flood/10 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-flood" />
                    </div>
                    <p>Address flood vulnerability by identifying and clearing blocked drains</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-energy/10 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-energy" />
                    </div>
                    <p>Combat energy poverty by mapping outages and promoting renewable solutions</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to={authenticated ? "/waste" : "/register"}>
                    <Button className="rounded-full">
                      {authenticated ? 'Start Contributing' : 'Join the Initiative'}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1626068963540-d25b64872431?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Mumbai cityscape" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-lg bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">7.5K</div>
                    <div className="text-xs text-muted-foreground">Tons waste daily</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-16 bg-accent text-accent-foreground">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
            <p className="text-accent-foreground/90 max-w-xl mx-auto mb-8">
              Join thousands of Mumbaikars working together to build a more sustainable future. 
              Every report, every action, every solution matters.
            </p>
            <Link to={authenticated ? "/waste" : "/register"}>
              <Button size="lg" variant="outline" className="rounded-full border-white/20 hover:bg-white/10">
                {authenticated ? 'Go to Dashboard' : 'Create an Account'}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="font-display font-medium">Smart Circular</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/waste" className="text-sm text-muted-foreground hover:text-foreground">
                Waste Management
              </Link>
              <Link to="/flood" className="text-sm text-muted-foreground hover:text-foreground">
                Flood Prevention
              </Link>
              <Link to="/electricity" className="text-sm text-muted-foreground hover:text-foreground">
                Energy Access
              </Link>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Circular Mumbai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
