import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, WasteCategory, DisposalMethod, WasteLog, LeaderboardEntry, Achievement, EducationalContent, RedemptionRequest } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Gemini API Key Queries
export function useGetDefaultGeminiApiKey() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['defaultGeminiApiKey'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getDefaultGeminiApiKey();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyGeminiApiKey() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['myGeminiApiKey'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getMyGeminiApiKey();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMyGeminiApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (apiKey: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setMyGeminiApiKey(apiKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGeminiApiKey'] });
      toast.success('API key saved successfully! 🎉');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save API key: ${error.message}`);
    },
  });
}

export function useRemoveMyGeminiApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMyGeminiApiKey();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGeminiApiKey'] });
      toast.success('API key removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove API key: ${error.message}`);
    },
  });
}

// Waste Logging Queries
export function useLogWaste() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, method, quantity }: { category: WasteCategory; method: DisposalMethod; quantity: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWaste(category, method, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wasteLogs'] });
      queryClient.invalidateQueries({ queryKey: ['ecoCoinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Waste logged successfully! EcoCoins earned! 🌱');
    },
    onError: (error: Error) => {
      toast.error(`Failed to log waste: ${error.message}`);
    },
  });
}

export function useGetMyWasteLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<WasteLog[]>({
    queryKey: ['wasteLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyWasteLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

// EcoCoin Queries
export function useGetMyEcoCoinBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['ecoCoinBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyEcoCoinBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

// Analytics Queries
export function useGetMyAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalWaste: number;
    categoryBreakdown: Array<[WasteCategory, number]>;
    methodBreakdown: Array<[DisposalMethod, number]>;
  }>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) return { totalWaste: 0, categoryBreakdown: [], methodBreakdown: [] };
      return actor.getMyAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// Leaderboard Queries
export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (principal: string) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.getUserProfile(Principal.fromText(principal));
    },
  });
}

// Achievements Queries
export function useGetMyAchievements() {
  const { actor, isFetching } = useActor();

  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAchievements();
    },
    enabled: !!actor && !isFetching,
  });
}

// Educational Content Queries
export function useGetEducationalContent() {
  const { actor, isFetching } = useActor();

  return useQuery<EducationalContent[]>({
    queryKey: ['educationalContent'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEducationalContent();
    },
    enabled: !!actor && !isFetching,
  });
}

// Shareable Link Queries
export function useCreateShareableLink() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ type, data }: { type: string; data: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createShareableLink(type, data);
    },
    onSuccess: (url) => {
      toast.success('Shareable link created!');
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create link: ${error.message}`);
    },
  });
}

// Redemption Queries
export function useCreateRedemptionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, cryptoType, exchangeRate }: { amount: bigint; cryptoType: string; exchangeRate: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRedemptionRequest(amount, cryptoType, exchangeRate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecoCoinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['redemptionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast.success('Redemption request submitted successfully! 🎉');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create redemption request: ${error.message}`);
    },
  });
}

export function useGetMyRedemptionRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<RedemptionRequest[]>({
    queryKey: ['redemptionRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRedemptionRequests();
    },
    enabled: !!actor && !isFetching,
  });
}
