import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useGameStats } from '@/hooks/useGameStats';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Target, Clock, Brain, Palette, MousePointer, Coins, Hammer, Star, RotateCcw, Home } from 'lucide-react';

const PlayerStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, resetAllStats, getTotalGamesPlayed } = useGameStats();
  
  const totalGamesPlayed = getTotalGamesPlayed();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Caricamento statistiche...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Statistiche Giocatore
          </h1>
          <p className="text-muted-foreground">
            {user ? `Benvenuto ${user.email?.split('@')[0]}! Ecco i tuoi progressi:` : 'Traccia i tuoi progressi in tutti i giochi!'}
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
                    <Badge variant="outline">{stats.counterGame.highScore}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.counterGame.gamesPlayed}</span>
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
                    <Badge variant="outline">{stats.memoryGame.bestMoves} mosse</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.memoryGame.gamesPlayed}</span>
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
                    <span>Miglior record:</span>
                    <Badge variant="outline">{stats.guessNumberGame.bestAttempts} tentativi</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.guessNumberGame.gamesPlayed}</span>
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
                    <Badge variant="outline">{stats.colorMatchGame.highScore}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Partite giocate:</span>
                    <span>{stats.colorMatchGame.gamesPlayed}</span>
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

          {/* Altri giochi possono essere aggiunti qui seguendo lo stesso pattern */}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Torna alla Home
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={resetAllStats}
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
              <p className="text-muted-foreground mb-4">
                {user ? 'Inizia a giocare per salvare le tue statistiche nel cloud!' : 'Accedi per salvare le tue statistiche nel cloud!'}
              </p>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="mt-4"
                >
                  Accedi per salvare i progressi
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;