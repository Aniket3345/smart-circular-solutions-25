
import React, { useState } from 'react';
import { User, updateUser, getCurrentUser } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Save, Trash2, MapPin, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfileCardProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    pincode: user?.pincode || '',
    address: user?.address || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const success = updateUser({
        name: formData.name,
        pincode: formData.pincode,
        address: formData.address,
      });
      
      if (success) {
        setUser(getCurrentUser());
        setIsEditing(false);
        toast({
          title: 'Profile updated successfully',
          description: 'Your profile information has been updated.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: 'An error occurred while updating your profile.',
        variant: 'destructive',
      });
    }
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
  );
};

export default UserProfileCard;
