import { useGetMyAchievements, useGetMyWasteLogs, useGetMyEcoCoinBalance, useCreateShareableLink } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Share2, Sparkles } from 'lucide-react';

export default function Achievements() {
  const { data: achievements } = useGetMyAchievements();
  const { data: wasteLogs } = useGetMyWasteLogs();
  const { data: ecoCoinBalance } = useGetMyEcoCoinBalance();
  const createShareableLink = useCreateShareableLink();

  const unlockedAchievements = achievements?.filter(a => a.unlocked) || [];
  const lockedAchievements = achievements?.filter(a => !a.unlocked) || [];

  // Predefined achievement badges with images
  const achievementBadges: Record<string, { image: string; description: string }> = {
    'first-log': {
      image: '/assets/generated/first-log-badge.dim_100x100.png',
      description: 'Log your first waste entry',
    },
    'ten-entries': {
      image: '/assets/generated/ten-entries-badge.dim_100x100.png',
      description: 'Complete 10 waste logs',
    },
    'fifty-entries': {
      image: '/assets/generated/fifty-entries-badge.dim_100x100.png',
      description: 'Complete 50 waste logs',
    },
    'hundred-entries': {
      image: '/assets/generated/hundred-entries-badge.dim_100x100.png',
      description: 'Complete 100 waste logs',
    },
    'streak-seven': {
      image: '/assets/generated/streak-seven-badge.dim_100x100.png',
      description: 'Log waste for 7 consecutive days',
    },
    'streak-thirty': {
      image: '/assets/generated/streak-thirty-badge.dim_100x100.png',
      description: 'Log waste for 30 consecutive days',
    },
    'thousand-coins': {
      image: '/assets/generated/thousand-coins-badge.dim_100x100.png',
      description: 'Earn 1000 EcoCoins',
    },
    'electronics-recycler': {
      image: '/assets/generated/electronics-recycling-badge.dim_100x100.png',
      description: 'Recycle 25kg of electronics waste',
    },
  };

  // Map achievements to badges
  const getBadgeInfo = (achievement: any) => {
    const totalLogs = wasteLogs?.length || 0;
    const coins = Number(ecoCoinBalance || 0);

    if (totalLogs >= 1 && achievement.name.includes('Total Waste')) {
      return achievementBadges['first-log'];
    }
    if (totalLogs >= 10) return achievementBadges['ten-entries'];
    if (totalLogs >= 50) return achievementBadges['fifty-entries'];
    if (totalLogs >= 100) return achievementBadges['hundred-entries'];
    if (coins >= 1000) return achievementBadges['thousand-coins'];
    if (achievement.name.includes('Electronics Waste')) {
      return achievementBadges['electronics-recycler'];
    }

    return {
      image: '/assets/generated/trophy-icon-transparent.dim_64x64.png',
      description: achievement.description,
    };
  };

  const handleShare = (achievement: any) => {
    const data = JSON.stringify({
      name: achievement.name,
      description: achievement.description,
      progress: Number(achievement.progress),
      target: Number(achievement.target),
    });
    createShareableLink.mutate({ type: 'achievement', data });
  };

  const totalProgress = achievements?.length
    ? (unlockedAchievements.length / achievements.length) * 100
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Achievements</h1>
        <p className="text-muted-foreground text-lg">
          Track your milestones and unlock badges for your eco-friendly actions.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            {unlockedAchievements.length} of {achievements?.length || 0} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={totalProgress} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Keep going to unlock all achievements!</span>
            <span className="font-bold text-primary">{totalProgress.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Unlocked Achievements
            </h2>
            <Badge variant="default" className="text-sm">
              {unlockedAchievements.length} Earned
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedAchievements.map((achievement) => {
              const badgeInfo = getBadgeInfo(achievement);
              return (
                <Card
                  key={Number(achievement.id)}
                  className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all"
                >
                  <CardHeader className="text-center space-y-4">
                    <div className="mx-auto relative">
                      <img
                        src={badgeInfo.image}
                        alt={achievement.name}
                        className="h-24 w-24 mx-auto drop-shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription className="mt-2">{badgeInfo.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold text-primary">
                        {Number(achievement.progress)} / {Number(achievement.target)}
                      </span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleShare(achievement)}
                      disabled={createShareableLink.isPending}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Achievement
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-6 w-6 text-muted-foreground" />
              Locked Achievements
            </h2>
            <Badge variant="secondary" className="text-sm">
              {lockedAchievements.length} Remaining
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map((achievement) => {
              const badgeInfo = getBadgeInfo(achievement);
              const progress = (Number(achievement.progress) / Number(achievement.target)) * 100;

              return (
                <Card
                  key={Number(achievement.id)}
                  className="border-2 hover:border-primary/30 transition-all"
                >
                  <CardHeader className="text-center space-y-4">
                    <div className="mx-auto relative">
                      <img
                        src={badgeInfo.image}
                        alt={achievement.name}
                        className="h-24 w-24 mx-auto opacity-40 grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-muted-foreground">
                        {achievement.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{badgeInfo.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold">
                        {Number(achievement.progress)} / {Number(achievement.target)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {Number(achievement.target) - Number(achievement.progress)} more to unlock
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!achievements || achievements.length === 0) && (
        <Card className="border-2">
          <CardContent className="text-center py-12 space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">No achievements yet</p>
              <p className="text-muted-foreground">Start logging waste to unlock achievements!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
