import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, TrendingUp, Award, Users, Coins, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        // Handle edge case
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6">
              <img src="/assets/generated/ecocycle-logo-transparent.dim_200x200.png" alt="EcoCycle" className="h-24 w-24" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary">
              EcoCycle
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your waste management into rewards. Log your eco-friendly actions, earn EcoCoins, and redeem them for cryptocurrency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <img src="/assets/generated/internet-identity-icon-transparent.dim_64x64.png" alt="II" className="h-5 w-5 mr-2" />
                    Get Started with Internet Identity
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure authentication powered by Internet Computer
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose EcoCycle?</h2>
            <p className="text-xl text-muted-foreground">Make a difference while earning rewards</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Track Your Impact</CardTitle>
                <CardDescription>
                  Log your waste disposal activities and see your environmental impact in real-time with detailed analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Earn EcoCoins</CardTitle>
                <CardDescription>
                  Get rewarded with EcoCoins for every eco-friendly action. Higher rewards for recycling and composting!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Redeem for Crypto</CardTitle>
                <CardDescription>
                  Convert your EcoCoins to Ethereum or Bitcoin. Turn your sustainable habits into real value.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Unlock Achievements</CardTitle>
                <CardDescription>
                  Earn badges and achievements as you reach milestones. Track your progress and celebrate your wins.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Join the Community</CardTitle>
                <CardDescription>
                  Compete on the leaderboard and see how you rank against other eco-warriors in the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Learn & Grow</CardTitle>
                <CardDescription>
                  Access educational content about sustainability and learn how to make a bigger environmental impact.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-5xl font-bold text-primary mb-2">10K+</p>
              <p className="text-muted-foreground">Waste Logs Recorded</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">500K+</p>
              <p className="text-muted-foreground">EcoCoins Earned</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">1K+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold text-primary">Ready to Make a Difference?</h2>
            <p className="text-xl text-muted-foreground">
              Join EcoCycle today and start earning rewards for your sustainable actions.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </footer>
    </div>
  );
}
