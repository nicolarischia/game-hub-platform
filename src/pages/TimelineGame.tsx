import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Shuffle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const timelineEvents = [
  { id: 1, event: "Primo sbarco sulla Luna", year: 1969 },
  { id: 2, event: "Caduta del Muro di Berlino", year: 1989 },
  { id: 3, event: "Invenzione di Internet", year: 1969 },
  { id: 4, event: "Prima Guerra Mondiale inizia", year: 1914 },
  { id: 5, event: "Scoperta dell'America", year: 1492 },
  { id: 6, event: "Invenzione della stampa", year: 1440 },
  { id: 7, event: "Nascita di Leonardo da Vinci", year: 1452 },
  { id: 8, event: "Rivoluzione Francese", year: 1789 },
  { id: 9, event: "Prima telefonia mobile", year: 1973 },
  { id: 10, event: "Fondazione di Google", year: 1998 }
];

interface TimelineEvent {
  id: number;
  event: string;
  year: number;
}

const TimelineGame = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [userOrder, setUserOrder] = useState<TimelineEvent[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Carica i punteggi dal localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('timeline-game-score');
    const savedAttempts = localStorage.getItem('timeline-game-attempts');
    if (savedScore) setScore(parseInt(savedScore));
    if (savedAttempts) setAttempts(parseInt(savedAttempts));
    
    startNewGame();
  }, []);

  // Salva i punteggi nel localStorage
  useEffect(() => {
    localStorage.setItem('timeline-game-score', score.toString());
    localStorage.setItem('timeline-game-attempts', attempts.toString());
  }, [score, attempts]);

  const startNewGame = () => {
    // Seleziona 5 eventi casuali
    const shuffled = [...timelineEvents].sort(() => Math.random() - 0.5);
    const selectedEvents = shuffled.slice(0, 5);
    
    // Mescola l'ordine per il giocatore
    const randomizedOrder = [...selectedEvents].sort(() => Math.random() - 0.5);
    
    setEvents(selectedEvents.sort((a, b) => a.year - b.year)); // Ordine corretto
    setUserOrder(randomizedOrder);
    setGameStatus('playing');
  };

  const moveEvent = (fromIndex: number, toIndex: number) => {
    if (gameStatus !== 'playing') return;
    
    const newOrder = [...userOrder];
    const [movedEvent] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedEvent);
    setUserOrder(newOrder);
  };

  const checkOrder = () => {
    const isCorrect = userOrder.every((event, index) => 
      event.id === events[index].id
    );
    
    setAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setGameStatus('correct');
      setScore(prev => prev + 1);
    } else {
      setGameStatus('incorrect');
    }
  };

  const resetStats = () => {
    setScore(0);
    setAttempts(0);
    localStorage.removeItem('timeline-game-score');
    localStorage.removeItem('timeline-game-attempts');
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
            Timeline Sorter
          </h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Punteggio: {score}/{attempts}</p>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Instructions */}
        <Card className="p-6 mb-8">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Riordina gli eventi cronologicamente</h2>
            <p className="text-muted-foreground">
              Trascina gli eventi per metterli in ordine dal più antico al più recente
            </p>
          </div>
        </Card>

        {/* Game Status */}
        {gameStatus !== 'playing' && (
          <Card className={`p-6 mb-6 text-center ${
            gameStatus === 'correct' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              {gameStatus === 'correct' ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
              <h3 className="text-xl font-bold">
                {gameStatus === 'correct' ? 'Corretto! 🎉' : 'Non corretto 😔'}
              </h3>
            </div>
            
            {gameStatus === 'incorrect' && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Ordine corretto:</p>
                <div className="space-y-1">
                  {events.map((event, index) => (
                    <p key={event.id} className="text-sm">
                      {index + 1}. {event.event} ({event.year})
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            <Button
              className="game-button"
              onClick={startNewGame}
            >
              Nuova Partita
            </Button>
          </Card>
        )}

        {/* Timeline Events */}
        <div className="space-y-4">
          {userOrder.map((event, index) => (
            <Card 
              key={event.id} 
              className={`p-4 cursor-move hover:shadow-lg transition-all ${
                gameStatus === 'correct' ? 'border-green-500' :
                gameStatus === 'incorrect' ? 'border-red-500' : ''
              }`}
              draggable={gameStatus === 'playing'}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                moveEvent(fromIndex, index);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.event}</h3>
                    {gameStatus !== 'playing' && (
                      <p className="text-sm text-muted-foreground">Anno: {event.year}</p>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  ⋮⋮
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Game Controls */}
        {gameStatus === 'playing' && (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              className="game-button"
              onClick={checkOrder}
            >
              Verifica Ordine
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={startNewGame}
            >
              <Shuffle className="w-4 h-4" />
              Nuovi Eventi
            </Button>
          </div>
        )}

        {/* Stats */}
        <Card className="mt-8 p-6 text-center">
          <h3 className="text-lg font-bold mb-4">Statistiche</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground">Partite vinte</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{attempts}</p>
              <p className="text-sm text-muted-foreground">Tentativi totali</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={resetStats}
          >
            Reset Statistiche
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default TimelineGame;