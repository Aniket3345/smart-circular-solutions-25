
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  CloudRain, 
  Zap, 
  Recycle, 
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import RewardBadge from "./RewardBadge";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isAuthenticated: boolean;
  userPoints?: number;
  userName?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated, 
  userPoints = 0, 
  userName = "",
  onLogout = () => {}
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/waste', label: 'Waste', icon: <Recycle className="w-5 h-5" /> },
    { path: '/flood', label: 'Flood', icon: <CloudRain className="w-5 h-5" /> },
    { path: '/electricity', label: 'Electricity', icon: <Zap className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-50 ${
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      } transition-all duration-300`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="font-display font-medium hidden sm:block">Smart Circular</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button 
                  variant={isActive(link.path) ? "default" : "ghost"} 
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${
                    isActive(link.path) ? 'animate-scale-in' : ''
                  }`}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <RewardBadge points={userPoints} />
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="text-muted-foreground hover:text-destructive hidden sm:flex"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm" className="rounded-full">
                    Join
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b animate-fade-in panel-transition">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button 
                  variant={isActive(link.path) ? "default" : "ghost"} 
                  className={`w-full justify-start rounded-lg mb-1 ${
                    isActive(link.path) ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Button>
              </Link>
            ))}
            
            {isAuthenticated && (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-lg text-destructive"
                onClick={onLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
