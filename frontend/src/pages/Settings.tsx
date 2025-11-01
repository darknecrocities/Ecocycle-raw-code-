import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Key, Shield, Sparkles, CheckCircle2, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useGetMyGeminiApiKey, useSetMyGeminiApiKey, useRemoveMyGeminiApiKey, useGetDefaultGeminiApiKey } from '../hooks/useQueries';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: currentApiKey, isLoading: loadingApiKey } = useGetMyGeminiApiKey();
  const { data: defaultApiKey } = useGetDefaultGeminiApiKey();
  const setApiKeyMutation = useSetMyGeminiApiKey();
  const removeApiKeyMutation = useRemoveMyGeminiApiKey();

  const isUsingDefault = currentApiKey === defaultApiKey;

  useEffect(() => {
    if (currentApiKey) {
      setApiKey(currentApiKey);
    }
  }, [currentApiKey]);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setHasChanges(value !== currentApiKey);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    // Basic validation - Gemini API keys typically start with "AIza"
    if (!apiKey.startsWith('AIza')) {
      toast.error('Invalid API key format. Gemini API keys typically start with "AIza"');
      return;
    }

    setApiKeyMutation.mutate(apiKey.trim(), {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleRemoveApiKey = () => {
    removeApiKeyMutation.mutate(undefined, {
      onSuccess: () => {
        // After removal, the backend will return the default key
        setHasChanges(false);
      },
    });
  };

  const handleResetToDefault = () => {
    if (defaultApiKey) {
      setApiKey(defaultApiKey);
      setHasChanges(defaultApiKey !== currentApiKey);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setIsValidating(true);
    try {
      // Test the API key with a simple request
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Hello'
              }]
            }]
          })
        }
      );

      if (response.ok) {
        toast.success('API key is valid! ✅');
      } else {
        const error = await response.json();
        toast.error(`API key validation failed: ${error.error?.message || 'Invalid key'}`);
      }
    } catch (error) {
      toast.error('Failed to validate API key. Please check your internet connection.');
      console.error('Error validating API key:', error);
    } finally {
      setIsValidating(false);
    }
  };

  if (loadingApiKey) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your EcoCycle preferences and integrations
          </p>
        </div>
        <Card className="border-2">
          <CardContent className="py-12">
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Loading settings...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your EcoCycle preferences and integrations
        </p>
      </div>

      {/* Gemini API Key Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img 
              src="/assets/generated/gemini-ai-icon-transparent.dim_64x64.png" 
              alt="Gemini AI" 
              className="h-6 w-6"
            />
            Gemini AI Integration
            <Badge variant="default" className="ml-auto">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure your Google Gemini API key for AI-powered waste recognition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored securely on the Internet Computer blockchain and is only used for direct communication with Google's Gemini API. 
              {isUsingDefault && ' You are currently using the default API key provided by EcoCycle.'}
            </AlertDescription>
          </Alert>

          {isUsingDefault && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                A default Gemini API key is pre-configured for your convenience. You can use it as-is or replace it with your own key for personalized usage.
              </AlertDescription>
            </Alert>
          )}

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Gemini API Key
              {isUsingDefault && (
                <Badge variant="secondary" className="ml-2">
                  Default Key
                </Badge>
              )}
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your Gemini API key (starts with AIza...)"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Don't have an API key? Get one for free at{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || !hasChanges || setApiKeyMutation.isPending}
              className="flex-1 sm:flex-none"
            >
              {setApiKeyMutation.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {hasChanges ? 'Save Changes' : 'Saved'}
                </>
              )}
            </Button>
            
            <Button
              onClick={handleTestApiKey}
              variant="outline"
              disabled={!apiKey.trim() || isValidating}
              className="flex-1 sm:flex-none"
            >
              {isValidating ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Test API Key
                </>
              )}
            </Button>

            {!isUsingDefault && defaultApiKey && (
              <Button
                onClick={handleResetToDefault}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            )}

            {!isUsingDefault && (
              <Button
                onClick={handleRemoveApiKey}
                variant="destructive"
                disabled={removeApiKeyMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                {removeApiKeyMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Custom Key
                  </>
                )}
              </Button>
            )}
          </div>

          <Separator />

          {/* How it Works */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              How AI Waste Recognition Works
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p>Upload a photo of your waste item on the Log Waste page</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p>The image is analyzed by Google's Gemini 2.5 Flash AI model using your configured API key</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p>AI suggests the waste category and you can accept or override it</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <p>Complete your waste log and earn EcoCoins!</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">AI Waste Recognition is Active</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isUsingDefault 
                    ? 'Using the default EcoCycle API key. All waste recognition features are fully functional.'
                    : 'Using your custom API key. All waste recognition features are fully functional.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Placeholder */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle>More Settings Coming Soon</CardTitle>
          <CardDescription>
            We're working on additional customization options for your EcoCycle experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Notification preferences</p>
            <p>• Privacy settings</p>
            <p>• Data export options</p>
            <p>• Theme customization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
