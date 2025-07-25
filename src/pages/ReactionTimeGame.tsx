import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Clock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GameState = 'waiting' | 'ready' | 'go' | 'clicked' | 'tooEarly';

const ReactionTimeGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const saved = localStorage.getItem('reaction-time-best');
    if (saved) setBestTime(parseInt(saved));
    
    const savedAttempts = localStorage.getItem('reaction-time-attempts');
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
  }, []);

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('reaction-time-best', bestTime.toString());
    }
  }, [bestTime]);

  useEffect(() => {
    if (attempts.length > 0) {
      localStorage.setItem('reaction-time-attempts', JSON.stringify(attempts));
    }
  }, [attempts]);

  const startGame = () => {
    setGameState('ready');
    setReactionTime(null);
    
    const delay = Math.random() * 4000 + 1000; // 1-5 secondi
    timeoutRef.current = setTimeout(() => {
      setGameState('go');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      setGameState('tooEarly');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    if (gameState === 'go') {
      const endTime = Date.now();
      const reaction = endTime - (startTimeRef.current || 0);
      setReactionTime(reaction);
      setGameState('clicked');
      
      setAttempts(prev => {
        const newAttempts = [reaction, ...prev.slice(0, 9)]; // Keep last 10
        return newAttempts;
      });

      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction);
      }
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return 0;
    return Math.round(attempts.reduce((sum, time) => sum + time, 0) / attempts.length);
  };

  const getSpeedRating = (time: number) => {
    if (time < 200) return { text: "Fulmine! ⚡", color: "text-yellow-500" };
    if (time < 250) return { text: "Velocissimo! 🚀", color: "text-green-500" };
    if (time < 300) return { text: "Veloce! 🏃‍♂️", color: "text-blue-500" };
    if (time < 400) return { text: "Buono! 👍", color: "text-purple-500" };
    return { text: "Puoi migliorare! 🐌", color: "text-orange-500" };
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'ready': return 'bg-red-500';
      case 'go': return 'bg-green-500';
      case 'tooEarly': return 'bg-yellow-500';
      default: return 'bg-card';
    }
  };

  const getInstruction = () => {
    switch (gameState) {
      case 'waiting': return 'Clicca "Inizia" per cominciare';
      case 'ready': return 'Aspetta il verde...';
      case 'go': return 'CLICCA ORA!';
      case 'clicked': return `${reactionTime}ms`;
      case 'tooEarly': return 'Troppo presto! Riprova';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full py-6 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Reaction Time
          </h1>
          <div className="text-right">
            {bestTime && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {bestTime}ms
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 text-center">
              <Zap className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Test i tuoi riflessi!</h2>
              <p className="text-muted-foreground mb-8">
                Clicca il più velocemente possibile quando lo sfondo diventa verde
              </p>

              <div 
                className={`w-full h-64 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${getBackgroundColor()}`}
                onClick={handleClick}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-2">
                    {getInstruction()}
                  </p>
                  {reactionTime && (
                    <p className={`text-lg font-semibold ${getSpeedRating(reactionTime).color}`}>
                      {getSpeedRating(reactionTime).text}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                {gameState === 'waiting' && (
                  <Button className="game-button" onClick={startGame}>
                    Inizia Test
                  </Button>
                )}
                {(gameState === 'clicked' || gameState === 'tooEarly') && (
                  <Button className="game-button" onClick={startGame}>
                    Riprova
                  </Button>
                )}
                <Button variant="outline" onClick={resetGame}>
                  Reset
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📊 Statistiche
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{bestTime || '--'}</p>
                  <p className="text-sm text-muted-foreground">Miglior tempo (ms)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">{getAverageTime() || '--'}</p>
                  <p className="text-sm text-muted-foreground">Tempo medio (ms)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{attempts.length}</p>
                  <p className="text-sm text-muted-foreground">Tentativi</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Ultimi tentativi
            </h3>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {attempts.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>Nessun tentativo ancora</p>
                </Card>
              ) : (
                attempts.map((time, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-lg font-semibold">{time}ms</span>
                      </div>
                      <span className={`text-sm font-medium ${getSpeedRating(time).color}`}>
                        {getSpeedRating(time).text.split(' ')[0]}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReactionTimeGame;