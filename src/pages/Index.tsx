import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, HelpCircle, Clock, Brain, Target, Palette, Zap, Users, Star, TrendingUp } from "lucide-react";

const games = [
  {
    id: "counter",
    title: "Counter Game",
    description: "Clicca e conta! Un semplice contatore con animazioni divertenti.",
    icon: Calculator,
    path: "/counter",
    difficulty: "Facile",
    players: "1",
    time: "2-5 min"
  },
  {
    id: "memory",
    title: "Memory Game",
    description: "Trova le coppie di carte identiche e allena la tua memoria!",
    icon: Brain,
    path: "/memory",
    difficulty: "Medio",
    players: "1",
    time: "3-10 min"
  },
  {
    id: "guess-number",
    title: "Guess the Number",
    description: "Indovina il numero nascosto con il minor numero di tentativi possibili.",
    icon: Target,
    path: "/guess-number",
    difficulty: "Facile",
    players: "1",
    time: "2-5 min"
  },
  {
    id: "color-match",
    title: "Color Match",
    description: "Abbina velocemente i colori al loro nome. Sfida il tempo!",
    icon: Palette,
    path: "/color-match",
    difficulty: "Medio",
    players: "1",
    time: "1-2 min"
  },
  {
    id: "reaction-time",
    title: "Reaction Time",
    description: "Testa la velocità dei tuoi riflessi e batti il tuo record!",
    icon: Zap,
    path: "/reaction-time",
    difficulty: "Facile",
    players: "1",
    time: "1-3 min"
  },
  {
    id: "whatif",
    title: "What If Generator",
    description: "Esplora scenari ipotetici e condividi le tue risposte creative!",
    icon: HelpCircle,
    path: "/whatif",
    difficulty: "Facile",
    players: "1+",
    time: "5-15 min"
  },
  {
    id: "timeline",
    title: "Timeline Sorter",
    description: "Riordina gli eventi storici nella sequenza cronologica corretta.",
    icon: Clock,
    path: "/timeline",
    difficulty: "Difficile",
    players: "1",
    time: "5-10 min"
  }
];

const stats = {
  totalGames: games.length,
  totalPlayers: "1000+",
  avgRating: 4.8
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Facile": return "bg-green-100 text-green-800";
    case "Medio": return "bg-yellow-100 text-yellow-800";
    case "Difficile": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative w-full py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Piattaforma di Giochi #1</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            GameHub
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            La collezione definitiva di mini-giochi interattivi. Sfida te stesso, migliora le tue abilità e divertiti!
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{stats.totalGames}</p>
              <p className="text-sm text-muted-foreground">Giochi Disponibili</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{stats.totalPlayers}</p>
              <p className="text-sm text-muted-foreground">Giocatori Attivi</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-current" />
                {stats.avgRating}
              </p>
              <p className="text-sm text-muted-foreground">Valutazione Media</p>
            </div>
          </div>
        </div>
      </header>

      {/* Games Section */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Esplora i Nostri Giochi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dalla velocità di reazione ai puzzle cerebrali, trova il gioco perfetto per te
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <Card 
              key={game.id} 
              className="group game-card hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(game.path)}
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <game.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {game.description}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{game.players} giocatori</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{game.time}</span>
                  </div>
                </div>

                {/* Play Button */}
                <Button 
                  className="w-full game-button group-hover:scale-105 transition-transform"
                  size="sm"
                >
                  Gioca Ora
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
            <div className="p-8 md:p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h3 className="text-3xl font-bold mb-4">Migliora le Tue Abilità</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Ogni gioco è progettato per stimolare diverse aree cognitive: memoria, riflessi, 
                logica e creatività. Gioca regolarmente per vedere i tuoi miglioramenti!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-4 py-2 bg-white/50 rounded-full">
                  <span className="text-sm font-medium">🧠 Memoria</span>
                </div>
                <div className="px-4 py-2 bg-white/50 rounded-full">
                  <span className="text-sm font-medium">⚡ Riflessi</span>
                </div>
                <div className="px-4 py-2 bg-white/50 rounded-full">
                  <span className="text-sm font-medium">🎯 Precisione</span>
                </div>
                <div className="px-4 py-2 bg-white/50 rounded-full">
                  <span className="text-sm font-medium">🤔 Logica</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GameHub
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                La piattaforma definitiva per mini-giochi intelligenti e divertenti. 
                Allena la mente mentre ti diverti!
              </p>
            </div>
            
            <div className="text-center">
              <h5 className="font-semibold mb-4">Giochi Popolari</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Memory Game</p>
                <p>Reaction Time</p>
                <p>Color Match</p>
                <p>Timeline Sorter</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h5 className="font-semibold mb-4">Seguici</h5>
              <div className="flex justify-center md:justify-end gap-4">
                <a href="#" className="w-10 h-10 bg-card rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  📱
                </a>
                <a href="#" className="w-10 h-10 bg-card rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  🐦
                </a>
                <a href="#" className="w-10 h-10 bg-card rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  💬
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Creato con ❤️ per il divertimento e l'apprendimento • © 2024 GameHub
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Tutti i punteggi vengono salvati localmente nel tuo browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;