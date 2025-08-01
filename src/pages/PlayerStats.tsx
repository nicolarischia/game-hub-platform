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
      <div className="min-h-screen hero-section p-4 flex items-center justify-center">
        <Card className="glass-effect p-12 glow-effect">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground">Caricamento statistiche...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-section p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="floating-animation mb-8">
            <h1 className="text-6xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 drop-shadow-lg">
              Statistiche Giocatore
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            {user ? `Benvenuto ${user.email?.split('@')[0]}! Ecco i tuoi progressi:` : 'Traccia i tuoi progressi in tutti i giochi!'}
          </p>
        </div>

        {/* Player Level & Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="md:col-span-2 game-card glow-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-br from-primary via-accent to-primary rounded-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                Livello Giocatore
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <Badge className={`${playerLevel.color} text-white text-xl p-4 rounded-2xl font-bold`}>
                  {playerLevel.level}
                </Badge>
                <div className="flex-1">
                  <Progress value={playerLevel.progress} className="mb-4 h-3" />
                  <p className="text-lg text-muted-foreground">
                    {totalGamesPlayed} partite giocate totali
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="game-card hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-yellow-500/20 via-yellow-400/20 to-yellow-600/20 rounded-2xl mb-4 inline-block">
                <Trophy className="h-12 w-12 text-yellow-500" />
              </div>
              <p className="text-4xl font-black text-foreground mb-2">{Object.keys(stats).length}</p>
              <p className="text-lg text-muted-foreground">Giochi provati</p>
            </CardContent>
          </Card>

          <Card className="game-card hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 via-blue-400/20 to-blue-600/20 rounded-2xl mb-4 inline-block">
                <Target className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-4xl font-black text-foreground mb-2">{totalGamesPlayed}</p>
              <p className="text-lg text-muted-foreground">Partite totali</p>
            </CardContent>
          </Card>
        </div>

        {/* Game-specific Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Counter Game */}
          {stats.counterGame && (
            <Card className="game-card hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-xl">
                    <MousePointer className="h-6 w-6 text-primary" />
                  </div>
                  Counter Game
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Record massimo:</span>
                    <Badge variant="outline" className="text-lg p-2">{stats.counterGame.highScore}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Partite giocate:</span>
                    <span className="text-lg font-semibold">{stats.counterGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Ultimo gioco:</span>
                    <span className="text-lg">{formatDate(stats.counterGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Memory Game */}
          {stats.memoryGame && (
            <Card className="game-card hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 via-purple-400/20 to-purple-600/20 rounded-xl">
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                  Memory Game
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Miglior punteggio:</span>
                    <Badge variant="outline" className="text-lg p-2">{stats.memoryGame.bestMoves} mosse</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Partite giocate:</span>
                    <span className="text-lg font-semibold">{stats.memoryGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Ultimo gioco:</span>
                    <span className="text-lg">{formatDate(stats.memoryGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guess Number Game */}
          {stats.guessNumberGame && (
            <Card className="game-card hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 via-green-400/20 to-green-600/20 rounded-xl">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  Guess Number
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Miglior record:</span>
                    <Badge variant="outline" className="text-lg p-2">{stats.guessNumberGame.bestAttempts} tentativi</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Partite giocate:</span>
                    <span className="text-lg font-semibold">{stats.guessNumberGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Ultimo gioco:</span>
                    <span className="text-lg">{formatDate(stats.guessNumberGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Color Match Game */}
          {stats.colorMatchGame && (
            <Card className="game-card hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-pink-500/20 via-pink-400/20 to-pink-600/20 rounded-xl">
                    <Palette className="h-6 w-6 text-pink-500" />
                  </div>
                  Color Match
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Miglior punteggio:</span>
                    <Badge variant="outline" className="text-lg p-2">{stats.colorMatchGame.highScore}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Partite giocate:</span>
                    <span className="text-lg font-semibold">{stats.colorMatchGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Ultimo gioco:</span>
                    <span className="text-lg">{formatDate(stats.colorMatchGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reaction Time Game */}
          {stats.reactionTimeGame && (
            <Card className="game-card hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-orange-500/20 via-orange-400/20 to-orange-600/20 rounded-xl">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  Reaction Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Miglior tempo:</span>
                    <Badge variant="outline" className="text-lg p-2">{formatTime(stats.reactionTimeGame.bestTime)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Partite giocate:</span>
                    <span className="text-lg font-semibold">{stats.reactionTimeGame.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Ultimo gioco:</span>
                    <span className="text-lg">{formatDate(stats.reactionTimeGame.lastPlayed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Altri giochi possono essere aggiunti qui seguendo lo stesso pattern */}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-6 mb-12">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-lg px-8 py-4 glass-effect hover:scale-105 transition-all duration-300"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Torna alla Home
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={resetAllStats}
            className="flex items-center gap-3 text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
            size="lg"
          >
            <RotateCcw className="h-5 w-5" />
            Reset Statistiche
          </Button>
        </div>

        {Object.keys(stats).length === 0 && (
          <Card className="text-center glass-effect glow-effect">
            <CardContent className="p-16">
              <div className="floating-animation mb-8">
                <Trophy className="h-24 w-24 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nessuna statistica disponibile
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
                {user ? 'Inizia a giocare per salvare le tue statistiche nel cloud!' : 'Accedi per salvare le tue statistiche nel cloud!'}
              </p>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="game-button text-lg px-8 py-4"
                  size="lg"
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