import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Minus, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CounterGame = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Carica il contatore dal localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('counter-game-count');
    if (savedCount) {
      setCount(parseInt(savedCount));
    }
  }, []);

  // Salva il contatore nel localStorage
  useEffect(() => {
    localStorage.setItem('counter-game-count', count.toString());
  }, [count]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    triggerAnimation();
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
    triggerAnimation();
  };

  const handleReset = () => {
    setCount(0);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getCountColor = () => {
    if (count > 50) return "text-green-500";
    if (count < -10) return "text-red-500";
    if (count === 0) return "text-muted-foreground";
    return "text-primary";
  };

  const getCountMessage = () => {
    if (count === 0) return "Inizia a contare!";
    if (count === 100) return "🎉 Hai raggiunto 100!";
    if (count === -50) return "😱 Sei a -50!";
    if (count > 0) return `Stai andando bene! +${count}`;
    return `Sei nel negativo: ${count}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            Counter Game
          </h1>
          <div></div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <Card className="game-card max-w-2xl mx-auto">
          <div className="text-center space-y-8">
            {/* Counter Display */}
            <div className="space-y-4">
              <div className={`counter-display ${getCountColor()} ${isAnimating ? 'pulse-animation' : ''}`}>
                {count}
              </div>
              <p className="text-lg text-muted-foreground bounce-in">
                {getCountMessage()}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-6">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full p-0 hover:scale-110 transition-transform"
                onClick={handleDecrement}
              >
                <Minus className="w-8 h-8" />
              </Button>
              
              <Button
                size="lg"
                className="game-button w-16 h-16 rounded-full p-0"
                onClick={handleIncrement}
              >
                <Plus className="w-8 h-8" />
              </Button>
            </div>

            {/* Reset Button */}
            <Button
              variant="secondary"
              className="flex items-center gap-2 hover:scale-105 transition-transform"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            {/* Game Info */}
            <div className="text-sm text-muted-foreground space-y-2 pt-6 border-t border-border">
              <p>💾 Il tuo punteggio viene salvato automaticamente</p>
              <p>🎯 Raggiungi 100 per sbloccare un messaggio speciale!</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CounterGame;