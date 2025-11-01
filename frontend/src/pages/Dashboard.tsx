import { useGetMyEcoCoinBalance, useGetMyWasteLogs, useGetMyAnalytics, useGetMyAchievements } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Leaf, TrendingUp, Trophy, Plus, Award, BookOpen, Sparkles } from 'lucide-react';
import type { PageView } from '../App';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: ecoCoinBalance } = useGetMyEcoCoinBalance();
  const { data: wasteLogs } = useGetMyWasteLogs();
  const { data: analytics } = useGetMyAnalytics();
  const { data: achievements } = useGetMyAchievements();

  const totalLogs = wasteLogs?.length || 0;
  const totalWaste = analytics?.totalWaste || 0;
  const unlockedAchievements = achievements?.filter(a => a.unlocked).length || 0;
  const totalAchievements = achievements?.length || 0;

  // Calculate streak (simplified - consecutive days)
  const calculateStreak = () => {
    if (!wasteLogs || wasteLogs.length === 0) return 0;
    const sortedLogs = [...wasteLogs].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    let streak = 1;
    let currentDate = new Date(Number(sortedLogs[0].timestamp) / 1000000);
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const logDate = new Date(Number(sortedLogs[i].timestamp) / 1000000);
      const dayDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        streak++;
        currentDate = logDate;
      } else if (dayDiff > 1) {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (totalLogs === 0) return "Start your eco-journey today! Log your first waste entry.";
    if (totalLogs < 5) return "Great start! Keep logging to build your eco-habits.";
    if (totalLogs < 10) return "You're on fire! 🔥 Your planet thanks you!";
    if (totalLogs < 25) return "Impressive dedication! You're making a real difference.";
    if (totalLogs < 50) return "Eco-warrior status unlocked! Keep up the amazing work!";
    return "You're an environmental champion! Your impact is incredible! 🌟";
  };

  const quickStats = [
    {
      title: 'EcoCoins',
      value: Number(ecoCoinBalance || 0),
      icon: Leaf,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Total earned',
    },
    {
      title: 'Waste Logs',
      value: totalLogs,
      icon: TrendingUp,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      description: 'Entries recorded',
    },
    {
      title: 'Achievements',
      value: `${unlockedAchievements}/${totalAchievements}`,
      icon: Trophy,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      description: 'Badges earned',
    },
    {
      title: 'Day Streak',
      value: streak,
      icon: Sparkles,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Consecutive days',
    },
  ];

  // Progress timeline milestones
  const milestones = [
    { logs: 1, label: 'First Log', achieved: totalLogs >= 1 },
    { logs: 10, label: '10 Logs', achieved: totalLogs >= 10 },
    { logs: 50, label: '50 Logs', achieved: totalLogs >= 50 },
    { logs: 100, label: '100 Logs', achieved: totalLogs >= 100 },
  ];

  const nextMilestone = milestones.find(m => !m.achieved);
  const progressToNext = nextMilestone ? (totalLogs / nextMilestone.logs) * 100 : 100;

  return (
    <div className="space-y-8">
      {/* Welcome Section with Motivational Message */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-8 border-2 border-primary/20">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Welcome Back!</h1>
              <p className="text-muted-foreground text-lg">{getMotivationalMessage()}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10">
          <img src="/assets/generated/ecocycle-logo-transparent.dim_200x200.png" alt="" className="h-48 w-48" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Progress Timeline */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Progress Journey
          </CardTitle>
          <CardDescription>Track your milestones and achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Milestone Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {nextMilestone ? `Next: ${nextMilestone.label}` : 'All milestones achieved! 🎉'}
              </span>
              <span className="text-muted-foreground">
                {totalLogs} / {nextMilestone?.logs || 100} logs
              </span>
            </div>
            <Progress value={progressToNext} className="h-3" />
          </div>

          {/* Milestone Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  milestone.achieved
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-muted/30 border-muted'
                }`}
              >
                <div className={`text-2xl font-bold ${milestone.achieved ? 'text-primary' : 'text-muted-foreground'}`}>
                  {milestone.logs}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{milestone.label}</div>
                {milestone.achieved && (
                  <div className="mt-2">
                    <Trophy className="h-4 w-4 text-primary mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="h-auto py-6 flex flex-col gap-2 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            onClick={() => onNavigate('log')}
          >
            <Plus className="h-6 w-6" />
            <span>Log Waste</span>
          </Button>
          <Button 
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2 hover:bg-chart-2/10 hover:border-chart-2/50"
            onClick={() => onNavigate('analytics')}
          >
            <TrendingUp className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
          <Button 
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2 hover:bg-chart-3/10 hover:border-chart-3/50"
            onClick={() => onNavigate('achievements')}
          >
            <Award className="h-6 w-6" />
            <span>Achievements</span>
          </Button>
          <Button 
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2 hover:bg-accent/30 hover:border-accent/50"
            onClick={() => onNavigate('education')}
          >
            <BookOpen className="h-6 w-6" />
            <span>Learn More</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest waste disposal logs</CardDescription>
            </div>
            {totalLogs > 0 && (
              <Button variant="outline" size="sm" onClick={() => onNavigate('analytics')}>
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {totalLogs === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">No waste logs yet</p>
                <p className="text-muted-foreground">Start logging your waste to see your activity here</p>
              </div>
              <Button onClick={() => onNavigate('log')} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Waste
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {wasteLogs?.slice(0, 5).map((log) => (
                <div key={Number(log.id)} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{log.category.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.quantity} kg • {log.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(Number(log.timestamp) / 1000000).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
