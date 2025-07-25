import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, HelpCircle, Clock } from "lucide-react";

const games = [
  {
    id: "counter",
    title: "Counter Game",
    description: "Clicca e conta! Un semplice contatore con animazioni divertenti.",
    icon: Calculator,
    path: "/counter"
  },
  {
    id: "whatif",
    title: "What If Generator",
    description: "Esplora scenari ipotetici e condividi le tue risposte!",
    icon: HelpCircle,
    path: "/whatif"
  },
  {
    id: "timeline",
    title: "Timeline Sorter",
    description: "Riordina gli eventi storici nella sequenza corretta.",
    icon: Clock,
    path: "/timeline"
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GameHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una collezione di mini-giochi divertenti e interattivi. Scegli il tuo preferito e inizia a giocare!
          </p>
        </div>
      </header>

      {/* Games Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Card 
              key={game.id} 
              className={`game-card fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(game.path)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">
                  {game.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
                <Button 
                  className="game-button mt-4"
                  size="lg"
                >
                  Gioca Ora
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Creato con ❤️ per il divertimento • © 2024 GameHub
          </p>
          <div className="mt-4 space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;