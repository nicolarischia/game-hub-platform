import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, Brain, Palette, MousePointer, Coins, Hammer, Star, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface GameStats {
  counterGame?: {
    highestCount: number;
    totalClicks: number;
    lastPlayed: string;
  };
  memoryGame?: {
    bestScore: number;
    gamesPlayed: number;
    averageScore: number;
    lastPlayed: string;
  };
  guessNumberGame?: {
    gamesWon: number;
    gamesPlayed: number;
    bestAttempts: number;
    averageAttempts: number;
    lastPlayed: string;
  };
  colorMatchGame?: {
    bestScore: number;
    gamesPlayed: number;
    bestTime: number;
    lastPlayed: string;
  };
  reactionTimeGame?: {
    bestTime: number;
    averageTime: number;
    gamesPlayed: number;
    lastPlayed: string;
  };
  passwordGame?: {
    gamesPlayed: number;
    gamesWon: number;
    bestAttempts: number;
    lastPlayed: string;
  };
  infiniteCraft?: {
    elementsDiscovered: number;
    lastPlayed: string;
  };
  auctionGame?: {
    itemsWon: number;
    totalProfit: number;
    bestProfit: number;
    lastPlayed: string;
  };
}

const PlayerStats = () => {
  const [stats, setStats] = useState<GameStats>({});
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  useEffect(() => {
    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      setStats(parsedStats);
      
      // Calculate total games played
      const total = Object.values(parsedStats).reduce((sum: number, gameStats: any) => {
        return sum + (gameStats?.gamesPlayed || 0);
      }, 0) as number;
      setTotalGamesPlayed(total);
    }
  }, []);

  const resetStats = () => {
    localStorage.removeItem('gameStats');
    setStats({});
    setTotalGamesPlayed(0);
    toast.success('Statistiche resettate!');
  };

  const getPlayerLevel = () => {
    if (totalGamesPlayed < 10) return { level: 'Principiante', color: 'bg-gray-500', progress: (totalGamesPlayed / 10) * 100 };
    if (totalGamesPlayed < 50) return { level: 'Intermedio', color: 'bg-blue-500', progress: ((totalGamesPlayed - 10) / 40) * 100 };
    if (totalGamesPlayed < 100) return { level: 'Avanzato', color: 'bg-purple-500', progress: ((totalGamesPlayed - 50) / 50) * 100 };
    return { level: 'Esperto', color: 'bg-yellow-500', progress: 100 };
  };

  const playerLevel = getPlayerLevel();

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Mai giocato';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Statistiche Giocatore
          </h1>
          <p className="text-muted-foreground">
            Traccia i tuoi progressi e achievements in tutti i giochi!
          </p>
        </div>

        {/* Player Level & Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Livello Giocatore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={`${playerLevel.color} text-white text-lg p-2`}>
                  {playerLevel.level}
                </Badge>
                <div className="flex-1">
                  <Progress value={playerLevel.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {totalGamesPlayed} partite giocate totali
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{Object.keys(stats).length}</p>
              <p className="text-sm text-muted-foreground">Giochi provati</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{totalGamesPlayed}</p>
              <p className="text-sm text-muted-foreground">Partite totali</p>
            </CardContent>
          </Card>
        </div>

        {/* Game-specific Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Counter Game */}
          {stats.counterGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  Counter Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Record massimo:</span>
                    <Badge variant="outline">{stats.counterGame.highestCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Click totali:</span>
                    <span>{stats.counterGame.totalClicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.counterGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Memory Game */}
          {stats.memoryGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Memory Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Miglior punteggio:</span>
                    <Badge variant="outline">{stats.memoryGame.bestScore}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.memoryGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Media punteggio:</span>
                    <span>{stats.memoryGame.averageScore?.toFixed(1) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.memoryGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guess Number Game */}
          {stats.guessNumberGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Guess Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Vittorie:</span>
                    <Badge variant="outline">{stats.guessNumberGame.gamesWon}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Percentuale vittoria:</span>
                    <span>{((stats.guessNumberGame.gamesWon / stats.guessNumberGame.gamesPlayed) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miglior record:</span>
                    <span>{stats.guessNumberGame.bestAttempts} tentativi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.guessNumberGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Color Match Game */}
          {stats.colorMatchGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Miglior punteggio:</span>
                    <Badge variant="outline">{stats.colorMatchGame.bestScore}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.colorMatchGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miglior tempo:</span>
                    <span>{formatTime(stats.colorMatchGame.bestTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.colorMatchGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reaction Time Game */}
          {stats.reactionTimeGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Reaction Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Miglior tempo:</span>
                    <Badge variant="outline">{formatTime(stats.reactionTimeGame.bestTime)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo medio:</span>
                    <span>{formatTime(stats.reactionTimeGame.averageTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.reactionTimeGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.reactionTimeGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Password Game */}
          {stats.passwordGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔐 Password Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Completamenti:</span>
                    <Badge variant="outline">{stats.passwordGame.gamesWon}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Tentativi totali:</span>
                    <span>{stats.passwordGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miglior record:</span>
                    <span>{stats.passwordGame.bestAttempts} tentativi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.passwordGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Infinite Craft */}
          {stats.infiniteCraft && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚗️ Infinite Craft
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Elementi scoperti:</span>
                    <Badge variant="outline">{stats.infiniteCraft.elementsDiscovered}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Progresso:</span>
                    <span>{((stats.infiniteCraft.elementsDiscovered / 47) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.infiniteCraft.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Auction Game */}
          {stats.auctionGame && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="h-5 w-5" />
                  Auction Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Oggetti vinti:</span>
                    <Badge variant="outline">{stats.auctionGame.itemsWon}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Profitto totale:</span>
                    <span className={stats.auctionGame.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      €{stats.auctionGame.totalProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miglior affare:</span>
                    <span className="text-green-600">€{stats.auctionGame.bestProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimo gioco:</span>
                    <span className="text-sm">{formatDate(stats.auctionGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <Button 
            variant="destructive" 
            onClick={resetStats}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Statistiche
          </Button>
        </div>

        {Object.keys(stats).length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nessuna statistica disponibile</h3>
              <p className="text-muted-foreground">
                Inizia a giocare per vedere le tue statistiche qui!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;