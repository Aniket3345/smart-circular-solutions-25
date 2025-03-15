
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Locate } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelected: (location: { address: string; latitude: number; longitude: number }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelected }) => {
  const [address, setAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        
        // For this demo, we'll just create a simple address string from the coordinates
        setAddress(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        
        // Notify parent
        onLocationSelected({
          address: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          latitude,
          longitude
        });
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter it manually.');
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would geocode the address to get coordinates
    // For this demo, we'll simulate this with random coordinates near Mumbai
    const mockLatitude = 19.076 + (Math.random() * 0.1 - 0.05);
    const mockLongitude = 72.877 + (Math.random() * 0.1 - 0.05);
    
    setCoords({ latitude: mockLatitude, longitude: mockLongitude });
    
    // Notify parent
    onLocationSelected({
      address,
      latitude: mockLatitude,
      longitude: mockLongitude
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="location">Location</Label>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={getGeolocation}
          disabled={isGettingLocation}
          className="h-8 px-2 text-xs"
        >
          {isGettingLocation ? (
            'Detecting...'
          ) : (
            <>
              <Locate className="h-3 w-3 mr-1" />
              Use current location
            </>
          )}
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter location address"
            className="pl-10 rounded-lg"
          />
        </div>
        <Button type="submit" size="sm">Confirm</Button>
      </form>

      {coords && (
        <div className="text-xs text-muted-foreground">
          Coordinates: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
