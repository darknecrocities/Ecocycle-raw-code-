import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile.mutate({ name: name.trim() });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto mb-4">
          <img src="/assets/generated/ecocycle-logo-transparent.dim_200x200.png" alt="EcoCycle" className="h-20 w-20 mx-auto" />
        </div>
        <CardTitle className="text-2xl">Welcome to EcoCycle!</CardTitle>
        <CardDescription>
          Let's get started by setting up your profile. What should we call you?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!name.trim() || saveProfile.isPending}
          >
            {saveProfile.isPending ? 'Setting up...' : 'Get Started'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
