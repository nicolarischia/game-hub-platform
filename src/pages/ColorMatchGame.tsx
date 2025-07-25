import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Palette, Timer, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = [
  { name: "Rosso", hex: "#EF4444", rgb: "rgb(239, 68, 68)" },
  { name: "Verde", hex: "#10B981", rgb: "rgb(16, 185, 129)" },
  { name: "Blu", hex: "#3B82F6", rgb: "rgb(59, 130, 246)" },
  { name: "Giallo", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
  { name: "Viola", hex: "#8B5CF6", rgb: "rgb(139, 92, 246)" },
  { name: "Rosa", hex: "#EC4899", rgb: "rgb(236, 72, 153)" },
  { name: "Arancione", hex: "#F97316", rgb: "rgb(249, 115, 22)" },
  { name: "Teal", hex: "#14B8A6", rgb: "rgb(20, 184, 166)" },
];

const ColorMatchGame = () => {
  const navigate = useNavigate();
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [options, setOptions] = useState<typeof colors>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('color-match-best');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setGameOver(false);
    generateNewRound();
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('color-match-best', score.toString());
    }
  };

  const generateNewRound = () => {
    const correctColor = colors[Math.floor(Math.random() * colors.length)];
    const wrongColors = colors.filter(c => c.name !== correctColor.name);
    const shuffledWrong = wrongColors.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correctColor, ...shuffledWrong].sort(() => Math.random() - 0.5);
    
    setCurrentColor(correctColor);
    setOptions(allOptions);
  };

  const handleGuess = (selectedColor: typeof colors[0]) => {
    if (!gameActive) return;
    
    if (selectedColor.name === currentColor.name) {
      setScore(prev => prev + 1);
      generateNewRound();
    } else {
      endGame();
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
            Color Match
          </h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {timeLeft}s
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!gameActive && !gameOver && (
          <Card className="game-card max-w-2xl mx-auto text-center">
            <div className="space-y-6">
              <Palette className="w-20 h-20 mx-auto text-primary" />
              <h2 className="text-3xl font-bold">Abbina i Colori!</h2>
              <p className="text-muted-foreground text-lg">
                Guarda il colore mostrato e scegli il nome corretto. Hai 30 secondi!
              </p>
              
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Punteggio attuale</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent flex items-center gap-1 justify-center">
                    <Star className="w-6 h-6" />
                    {bestScore}
                  </p>
                  <p className="text-sm text-muted-foreground">Record personale</p>
                </div>
              </div>
              
              <Button className="game-button text-lg px-8 py-4" onClick={startGame}>
                Inizia a Giocare
              </Button>
            </div>
          </Card>
        )}

        {gameActive && (
          <div className="space-y-8">
            <Card className="p-8 text-center">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Punti</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-destructive">{timeLeft}</p>
                    <p className="text-sm text-muted-foreground">Secondi</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Che colore è questo?</h2>
                
                <div 
                  className="w-40 h-40 mx-auto rounded-2xl shadow-lg border-4 border-white"
                  style={{ backgroundColor: currentColor.hex }}
                ></div>
              </div>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map((color, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 text-lg font-semibold hover:scale-105 transition-transform"
                  onClick={() => handleGuess(color)}
                >
                  {color.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {gameOver && (
          <Card className="game-card max-w-2xl mx-auto text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                {score > bestScore ? "Nuovo Record! 🎉" : "Game Over!"}
              </h2>
              <p className="text-xl text-muted-foreground">
                Hai totalizzato <span className="font-bold text-primary">{score}</span> punti!
              </p>
              
              {score === bestScore && score > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-yellow-800 font-semibold">Hai battuto il tuo record!</p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button className="game-button" onClick={startGame}>
                  Gioca Ancora
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Torna alla Home
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ColorMatchGame;