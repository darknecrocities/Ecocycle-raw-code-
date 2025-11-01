import { useGetLeaderboard, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../backend';

export default function Leaderboard() {
  const { data: leaderboard } = useGetLeaderboard();
  const { identity } = useInternetIdentity();
  const getUserProfile = useGetUserProfile();
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  // Sort leaderboard by EcoCoins
  const sortedLeaderboard = [...(leaderboard || [])].sort((a, b) => 
    Number(b.ecoCoins) - Number(a.ecoCoins)
  );

  const currentUserPrincipal = identity?.getPrincipal().toString();
  const currentUserRank = sortedLeaderboard.findIndex(
    entry => entry.user.toString() === currentUserPrincipal
  ) + 1;

  // Fetch user profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = new Map<string, UserProfile>();
      for (const entry of sortedLeaderboard) {
        const principalStr = entry.user.toString();
        if (!userProfiles.has(principalStr)) {
          try {
            const profile = await getUserProfile.mutateAsync(principalStr);
            if (profile) {
              profiles.set(principalStr, profile);
            }
          } catch (error) {
            console.error('Failed to fetch profile:', error);
          }
        }
      }
      setUserProfiles(prev => new Map([...prev, ...profiles]));
    };

    if (sortedLeaderboard.length > 0) {
      fetchProfiles();
    }
  }, [sortedLeaderboard.length]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (rank === 2) return 'bg-gray-400/10 text-gray-600 border-gray-400/20';
    if (rank === 3) return 'bg-amber-600/10 text-amber-600 border-amber-600/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground text-lg">
          See how you rank among the top environmental contributors.
        </p>
      </div>

      {/* Current User Rank */}
      {currentUserRank > 0 && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center font-bold ${getRankBadge(currentUserRank)}`}>
                  #{currentUserRank}
                </div>
                <div>
                  <p className="font-medium">Your Rank</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUserRank === 1 ? '🎉 You\'re #1!' : `Keep going to reach the top!`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {Number(sortedLeaderboard[currentUserRank - 1]?.ecoCoins || 0)}
                </p>
                <p className="text-sm text-muted-foreground">EcoCoins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {sortedLeaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <Card className="border-2 border-gray-400/20 mt-8">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <Medal className="h-12 w-12 text-gray-400" />
              </div>
              <Avatar className="h-16 w-16 mx-auto border-2 border-gray-400">
                <AvatarFallback className="bg-gray-400/10 text-gray-600">
                  {userProfiles.get(sortedLeaderboard[1].user.toString())
                    ? getInitials(userProfiles.get(sortedLeaderboard[1].user.toString())!.name)
                    : '2'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium truncate">
                  {userProfiles.get(sortedLeaderboard[1].user.toString())?.name || 'User'}
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {Number(sortedLeaderboard[1].ecoCoins)}
                </p>
                <p className="text-xs text-muted-foreground">EcoCoins</p>
              </div>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <Avatar className="h-20 w-20 mx-auto border-4 border-yellow-500">
                <AvatarFallback className="bg-yellow-500/10 text-yellow-600">
                  {userProfiles.get(sortedLeaderboard[0].user.toString())
                    ? getInitials(userProfiles.get(sortedLeaderboard[0].user.toString())!.name)
                    : '1'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium truncate">
                  {userProfiles.get(sortedLeaderboard[0].user.toString())?.name || 'User'}
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {Number(sortedLeaderboard[0].ecoCoins)}
                </p>
                <p className="text-xs text-muted-foreground">EcoCoins</p>
              </div>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          <Card className="border-2 border-amber-600/20 mt-8">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <Award className="h-12 w-12 text-amber-600" />
              </div>
              <Avatar className="h-16 w-16 mx-auto border-2 border-amber-600">
                <AvatarFallback className="bg-amber-600/10 text-amber-600">
                  {userProfiles.get(sortedLeaderboard[2].user.toString())
                    ? getInitials(userProfiles.get(sortedLeaderboard[2].user.toString())!.name)
                    : '3'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium truncate">
                  {userProfiles.get(sortedLeaderboard[2].user.toString())?.name || 'User'}
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {Number(sortedLeaderboard[2].ecoCoins)}
                </p>
                <p className="text-xs text-muted-foreground">EcoCoins</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>All Rankings</CardTitle>
          <CardDescription>Complete leaderboard of all contributors</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedLeaderboard.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">No rankings yet</p>
                <p className="text-muted-foreground">Be the first to log waste and earn EcoCoins!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedLeaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.user.toString() === currentUserPrincipal;
                const profile = userProfiles.get(entry.user.toString());

                return (
                  <div
                    key={entry.user.toString()}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      isCurrentUser ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold ${getRankBadge(rank)}`}>
                        {getRankIcon(rank) || `#${rank}`}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {profile ? getInitials(profile.name) : rank}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {profile?.name || 'User'}
                          {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Number(entry.wasteLogged)} logs
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <img src="/assets/generated/ecocoin-token-transparent.dim_100x100.png" alt="EcoCoin" className="h-5 w-5" />
                        <span className="text-xl font-bold text-primary">
                          {Number(entry.ecoCoins)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
