import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('memory-game-best');
    if (saved) setBestScore(parseInt(saved));
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameComplete && bestScore !== null) {
      localStorage.setItem('memory-game-best', bestScore.toString());
    }
  }, [bestScore, gameComplete]);

  const initializeGame = () => {
    const gameEmojis = emojis.slice(0, 8);
    const pairedEmojis = [...gameEmojis, ...gameEmojis];
    const shuffled = pairedEmojis.sort(() => Math.random() - 0.5);
    
    const gameCards = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
  };

  const flipCard = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        checkMatch(newFlipped);
      }, 1000);
    }
  };

  const checkMatch = (flipped: number[]) => {
    const [first, second] = flipped;
    const newCards = [...cards];

    if (newCards[first].emoji === newCards[second].emoji) {
      newCards[first].isMatched = true;
      newCards[second].isMatched = true;
      const newMatches = matches + 1;
      setMatches(newMatches);
      
      if (newMatches === 8) {
        setGameComplete(true);
        if (!bestScore || moves + 1 < bestScore) {
          setBestScore(moves + 1);
        }
      }
    } else {
      newCards[first].isFlipped = false;
      newCards[second].isFlipped = false;
    }

    setCards(newCards);
    setFlippedCards([]);
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
            Memory Game
          </h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Mosse: {moves}</p>
            {bestScore && <p className="text-xs text-muted-foreground">Record: {bestScore}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {gameComplete && (
          <Card className="p-6 mb-6 text-center border-green-500 bg-green-50">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">Complimenti! 🎉</h2>
            <p className="text-muted-foreground mb-4">
              Hai completato il gioco in {moves} mosse!
            </p>
            <Button className="game-button" onClick={initializeGame}>
              Gioca Ancora
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`aspect-square cursor-pointer transition-all duration-300 hover:scale-105 ${
                card.isFlipped || card.isMatched ? 'bg-primary' : 'bg-card hover:bg-muted'
              }`}
              onClick={() => flipCard(card.id)}
            >
              <div className="h-full flex items-center justify-center text-4xl">
                {card.isFlipped || card.isMatched ? card.emoji : '❓'}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 mx-auto"
            onClick={initializeGame}
          >
            <RotateCcw className="w-4 h-4" />
            Nuovo Gioco
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MemoryGame;