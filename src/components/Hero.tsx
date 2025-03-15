
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Recycle,
  CloudRain,
  Zap,
  ChevronRight
} from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pb-16 pt-24 sm:pt-32">
      {/* Background gradients */}
      <div className="absolute inset-0 hero-gradient opacity-20" aria-hidden="true" />
      
      {/* Animated floating shapes */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-float" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl animate-float delay-1000" aria-hidden="true" />
      
      <div className="relative container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6 animate-fade-in">
          <span>Smart Circular Cities Initiative</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-fade-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <span className="block">Tackling Mumbai's</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Sustainability Challenges</span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl animate-fade-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          Join our community-driven platform to address waste management, flood prevention, 
          and energy access through technology and collective action.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <Link to="/register">
            <Button size="lg" className="rounded-full group">
              Get Started
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/waste">
            <Button variant="outline" size="lg" className="rounded-full">
              Learn More
            </Button>
          </Link>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full animate-fade-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <Link to="/waste" className="glass-card p-6 hover:scale-[1.02] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-waste/10 flex items-center justify-center mb-4 group-hover:bg-waste/20 transition-colors">
              <Recycle className="w-6 h-6 text-waste" />
            </div>
            <h3 className="text-xl font-bold mb-2">Waste Management</h3>
            <p className="text-muted-foreground">Identify waste types, find recycling centers, and earn rewards for responsible disposal.</p>
          </Link>
          
          <Link to="/flood" className="glass-card p-6 hover:scale-[1.02] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-flood/10 flex items-center justify-center mb-4 group-hover:bg-flood/20 transition-colors">
              <CloudRain className="w-6 h-6 text-flood" />
            </div>
            <h3 className="text-xl font-bold mb-2">Flood Prevention</h3>
            <p className="text-muted-foreground">Report and monitor flood-prone areas, blocked drains, and receive real-time alerts.</p>
          </Link>
          
          <Link to="/electricity" className="glass-card p-6 hover:scale-[1.02] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-energy/10 flex items-center justify-center mb-4 group-hover:bg-energy/20 transition-colors">
              <Zap className="w-6 h-6 text-energy" />
            </div>
            <h3 className="text-xl font-bold mb-2">Energy Access</h3>
            <p className="text-muted-foreground">Report outages, find renewable energy options, and track community power initiatives.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
