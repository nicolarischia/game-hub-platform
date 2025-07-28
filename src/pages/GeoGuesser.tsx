import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Target, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl: string;
  hint: string;
}

interface Guess {
  lat: number;
  lng: number;
  distance: number;
  points: number;
}

const GeoGuesser = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastGuess, setLastGuess] = useState<Guess | null>(null);
  const [guessPosition, setGuessPosition] = useState<{ x: number; y: number } | null>(null);

  const locations: Location[] = [
    {
      id: '1',
      name: 'Torre Eiffel',
      country: 'Francia',
      lat: 48.8584,
      lng: 2.2945,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      hint: 'Iconica torre in ferro battuto del XIX secolo'
    },
    {
      id: '2',
      name: 'Colosseo',
      country: 'Italia',
      lat: 41.8902,
      lng: 12.4922,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      hint: 'Anfiteatro romano antico'
    },
    {
      id: '3',
      name: 'Cristo Redentore',
      country: 'Brasile',
      lat: -22.9519,
      lng: -43.2105,
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
      hint: 'Statua di Gesù Cristo su una montagna'
    },
    {
      id: '4',
      name: 'Big Ben',
      country: 'Regno Unito',
      lat: 51.4994,
      lng: -0.1245,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      hint: 'Torre dell\'orologio del Palazzo di Westminster'
    },
    {
      id: '5',
      name: 'Opera House',
      country: 'Australia',
      lat: -33.8568,
      lng: 151.2153,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      hint: 'Teatro dell\'opera con la caratteristica forma a conchiglia'
    },
    {
      id: '6',
      name: 'Machu Picchu',
      country: 'Perù',
      lat: -13.1631,
      lng: -72.5450,
      imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      hint: 'Antica cittadella inca sulle montagne'
    },
    {
      id: '7',
      name: 'Statua della Libertà',
      country: 'Stati Uniti',
      lat: 40.6892,
      lng: -74.0445,
      imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
      hint: 'Simbolo di libertà su un\'isola'
    },
    {
      id: '8',
      name: 'Taj Mahal',
      country: 'India',
      lat: 27.1751,
      lng: 78.0421,
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      hint: 'Mausoleo in marmo bianco con cupola centrale'
    }
  ];

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculatePoints = (distance: number): number => {
    if (distance < 50) return 5000;
    if (distance < 200) return 4000;
    if (distance < 500) return 3000;
    if (distance < 1000) return 2000;
    if (distance < 2000) return 1000;
    return Math.max(0, 500 - Math.floor(distance / 10));
  };

  const generateNewLocation = () => {
    const availableLocations = locations.filter(loc => loc.id !== currentLocation?.id);
    const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
    setCurrentLocation(randomLocation);
    setShowResult(false);
    setLastGuess(null);
    setGuessPosition(null);
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!currentLocation || showResult) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Conversione approssimativa delle coordinate del click in lat/lng
    // Assumendo una mappa del mondo semplificata
    const lng = ((x / rect.width) * 360) - 180;
    const lat = 90 - ((y / rect.height) * 180);
    
    setGuessPosition({ x, y });
    
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, lat, lng);
    const points = calculatePoints(distance);
    
    const guess: Guess = { lat, lng, distance, points };
    setLastGuess(guess);
    setScore(prev => prev + points);
    setShowResult(true);
    
    toast.success(`Hai totalizzato ${points} punti! Distanza: ${Math.round(distance)} km`);
  };

  const nextRound = () => {
    if (round >= totalRounds) {
      setGameOver(true);
      // Save stats
      const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
      stats.geoGuesser = {
        gamesPlayed: (stats.geoGuesser?.gamesPlayed || 0) + 1,
        bestScore: Math.max(stats.geoGuesser?.bestScore || 0, score),
        averageScore: ((stats.geoGuesser?.averageScore || 0) * (stats.geoGuesser?.gamesPlayed || 0) + score) / ((stats.geoGuesser?.gamesPlayed || 0) + 1),
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem('gameStats', JSON.stringify(stats));
    } else {
      setRound(prev => prev + 1);
      generateNewLocation();
    }
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setLastGuess(null);
    setGuessPosition(null);
    generateNewLocation();
  };

  useEffect(() => {
    generateNewLocation();
  }, []);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-4">Partita Terminata!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-3xl font-bold text-primary">{score} punti</p>
              <p className="text-muted-foreground">
                Punteggio medio: {Math.round(score / totalRounds)} punti per round
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={resetGame} className="w-full">
                Gioca Ancora
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alla Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            GeoGuesser
          </h1>
          <p className="text-muted-foreground">
            Indovina dove è stata scattata questa foto!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{round}/{totalRounds}</p>
              <p className="text-sm text-muted-foreground">Round</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{score.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Punteggio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">
                {lastGuess ? `${Math.round(lastGuess.distance)} km` : '-'}
              </p>
              <p className="text-sm text-muted-foreground">Ultima distanza</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto Misteriosa</CardTitle>
            </CardHeader>
            <CardContent>
              {currentLocation && (
                <div className="space-y-4">
                  <img
                    src={currentLocation.imageUrl}
                    alt="Posizione misteriosa"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      Suggerimento
                    </Badge>
                    <p className="text-muted-foreground">{currentLocation.hint}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mappa del Mondo</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="relative w-full h-64 bg-gradient-to-b from-blue-200 to-green-200 rounded-lg cursor-crosshair border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors"
                onClick={handleMapClick}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e0f2fe'/%3E%3Cpath d='M50 120 Q100 100 150 120 T250 120 Q300 100 350 120 V200 H50 Z' fill='%23c8e6c9'/%3E%3Cpath d='M0 130 Q50 110 100 130 T200 130 Q250 110 300 130 T400 130 V200 H0 Z' fill='%23a5d6a7'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-center text-muted-foreground bg-background/80 p-2 rounded">
                    {showResult ? 'Clicca "Prossimo Round" per continuare' : 'Clicca sulla mappa per indovinare!'}
                  </p>
                </div>
                
                {guessPosition && (
                  <div 
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-2 -translate-y-2"
                    style={{ left: guessPosition.x, top: guessPosition.y }}
                  />
                )}
                
                {showResult && currentLocation && (
                  <div 
                    className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white transform -translate-x-2 -translate-y-2"
                    style={{ 
                      left: `${((currentLocation.lng + 180) / 360) * 100}%`, 
                      top: `${((90 - currentLocation.lat) / 180) * 100}%` 
                    }}
                  />
                )}
              </div>
              
              {showResult && lastGuess && currentLocation && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Posizione corretta:</span>
                    <Badge variant="outline">{currentLocation.name}, {currentLocation.country}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Distanza:</span>
                    <span className="font-bold">{Math.round(lastGuess.distance)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Punti guadagnati:</span>
                    <span className="font-bold text-primary">+{lastGuess.points}</span>
                  </div>
                  <Button onClick={nextRound} className="w-full mt-4">
                    {round >= totalRounds ? 'Termina Partita' : 'Prossimo Round'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeoGuesser;