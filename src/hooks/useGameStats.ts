import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GameStats {
  counterGame?: {
    highScore: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  memoryGame?: {
    bestMoves: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  guessNumberGame?: {
    bestAttempts: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  colorMatchGame?: {
    highScore: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  reactionTimeGame?: {
    bestTime: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  passwordGame?: {
    bestTime: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  infiniteCraft?: {
    elementsCreated: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  auctionGame?: {
    bestScore: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  geoGuesser?: {
    highScore: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  asteroidLauncher?: {
    biggestImpact: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
}

export const useGameStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GameStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatsFromDatabase();
    } else {
      loadStatsFromLocalStorage();
    }
  }, [user]);

  const loadStatsFromDatabase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_stats')
        .select('game_type, stats_data')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading stats:', error);
        loadStatsFromLocalStorage();
        return;
      }

      const gameStats: GameStats = {};
      data?.forEach(({ game_type, stats_data }) => {
        gameStats[game_type as keyof GameStats] = stats_data as any;
      });

      setStats(gameStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      loadStatsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadStatsFromLocalStorage = () => {
    setLoading(true);
    try {
      const gameTypes = [
        'counterGame', 'memoryGame', 'guessNumberGame', 'colorMatchGame',
        'reactionTimeGame', 'passwordGame', 'infiniteCraft', 'auctionGame',
        'geoGuesser', 'asteroidLauncher'
      ];

      const localStats: GameStats = {};
      gameTypes.forEach(gameType => {
        const data = localStorage.getItem(`${gameType}Stats`);
        if (data) {
          try {
            localStats[gameType as keyof GameStats] = JSON.parse(data);
          } catch (e) {
            console.error(`Error parsing ${gameType} stats:`, e);
          }
        }
      });

      setStats(localStats);
    } catch (error) {
      console.error('Error loading local stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGameStats = async (gameType: keyof GameStats, gameStats: any) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('game_stats')
          .upsert({
            user_id: user.id,
            game_type: gameType,
            stats_data: gameStats
          });

        if (error) {
          console.error('Error saving stats to database:', error);
          toast.error('Errore nel salvare le statistiche');
          // Fallback to localStorage
          localStorage.setItem(`${gameType}Stats`, JSON.stringify(gameStats));
        }
      } catch (error) {
        console.error('Error saving stats:', error);
        localStorage.setItem(`${gameType}Stats`, JSON.stringify(gameStats));
      }
    } else {
      localStorage.setItem(`${gameType}Stats`, JSON.stringify(gameStats));
    }

    // Update local state
    setStats(prev => ({
      ...prev,
      [gameType]: gameStats
    }));
  };

  const resetAllStats = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('game_stats')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Error resetting stats in database:', error);
          toast.error('Errore nel resettare le statistiche');
        } else {
          toast.success('Statistiche resettate con successo!');
        }
      } catch (error) {
        console.error('Error resetting stats:', error);
      }
    } else {
      // Clear localStorage
      const gameTypes = [
        'counterGame', 'memoryGame', 'guessNumberGame', 'colorMatchGame',
        'reactionTimeGame', 'passwordGame', 'infiniteCraft', 'auctionGame',
        'geoGuesser', 'asteroidLauncher'
      ];
      
      gameTypes.forEach(gameType => {
        localStorage.removeItem(`${gameType}Stats`);
      });
      
      toast.success('Statistiche resettate con successo!');
    }

    setStats({});
  };

  const getTotalGamesPlayed = () => {
    return Object.values(stats).reduce((total, gameStat) => {
      return total + (gameStat?.gamesPlayed || 0);
    }, 0);
  };

  return {
    stats,
    loading,
    saveGameStats,
    resetAllStats,
    getTotalGamesPlayed
  };
};