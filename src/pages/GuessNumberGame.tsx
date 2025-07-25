import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Target, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GuessNumberGame = () => {
  const navigate = useNavigate();
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [guessHistory, setGuessHistory] = useState<Array<{guess: number, feedback: string}>>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('guess-number-stats');
    if (saved) {
      const stats = JSON.parse(saved);
      setGamesPlayed(stats.gamesPlayed || 0);
      setTotalAttempts(stats.totalAttempts || 0);
    }
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setFeedback("");
    setGameWon(false);
    setGuessHistory([]);
  };

  const makeGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setFeedback("Inserisci un numero tra 1 e 100!");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let newFeedback = "";
    if (guessNum === targetNumber) {
      setGameWon(true);
      newFeedback = "🎉 Perfetto!";
      
      const newGamesPlayed = gamesPlayed + 1;
      const newTotalAttempts = totalAttempts + newAttempts;
      setGamesPlayed(newGamesPlayed);
      setTotalAttempts(newTotalAttempts);
      
      localStorage.setItem('guess-number-stats', JSON.stringify({
        gamesPlayed: newGamesPlayed,
        totalAttempts: newTotalAttempts
      }));
    } else if (guessNum < targetNumber) {
      newFeedback = "📈 Troppo basso!";
    } else {
      newFeedback = "📉 Troppo alto!";
    }
    
    setFeedback(newFeedback);
    setGuessHistory(prev => [...prev, { guess: guessNum, feedback: newFeedback }]);
    setGuess("");
  };

  const getHint = () => {
    const range = Math.abs(parseInt(guess) - targetNumber);
    if (range <= 5) return "🔥 Caldissimo!";
    if (range <= 10) return "🌡️ Caldo!";
    if (range <= 20) return "😐 Tiepido";
    return "🧊 Freddo";
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
            Guess the Number
          </h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tentativi: {attempts}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="game-card">
              <div className="text-center space-y-6">
                <Target className="w-16 h-16 mx-auto text-primary" />
                <h2 className="text-2xl font-bold">Indovina il numero!</h2>
                <p className="text-muted-foreground">
                  Ho pensato a un numero tra 1 e 100. Riesci a indovinarlo?
                </p>

                {!gameWon ? (
                  <div className="space-y-4">
                    <Input
                      type="number"
                      placeholder="Inserisci il tuo numero..."
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
                      min="1"
                      max="100"
                      className="text-center text-lg"
                    />
                    
                    <Button
                      className="game-button w-full"
                      onClick={makeGuess}
                      disabled={!guess}
                    >
                      Indovina!
                    </Button>

                    {feedback && (
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">{feedback}</p>
                        {guess && !gameWon && (
                          <p className="text-sm text-muted-foreground">{getHint()}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
                    <h3 className="text-xl font-bold">Congratulazioni!</h3>
                    <p className="text-muted-foreground">
                      Hai indovinato {targetNumber} in {attempts} tentativi!
                    </p>
                    <Button
                      className="game-button"
                      onClick={startNewGame}
                    >
                      Nuovo Gioco
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📊 Statistiche
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{gamesPlayed}</p>
                  <p className="text-sm text-muted-foreground">Partite giocate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {gamesPlayed > 0 ? Math.round(totalAttempts / gamesPlayed) : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Media tentativi</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Cronologia tentativi</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {guessHistory.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>I tuoi tentativi appariranno qui</p>
                </Card>
              ) : (
                guessHistory.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-lg font-semibold">{item.guess}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.feedback.includes("Troppo basso") && <TrendingUp className="w-4 h-4 text-blue-500" />}
                        {item.feedback.includes("Troppo alto") && <TrendingDown className="w-4 h-4 text-red-500" />}
                        {item.feedback.includes("Perfetto") && <CheckCircle className="w-4 h-4 text-green-500" />}
                        <span className="text-sm">{item.feedback}</span>
                      </div>
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

export default GuessNumberGame;