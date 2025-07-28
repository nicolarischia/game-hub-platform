import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Zap, AlertTriangle, Target, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AsteroidData {
  diameter: number;
  velocity: number;
  mass: number;
  energy: number;
}

interface ImpactResults {
  craterDiameter: number;
  earthquakeMagnitude: number;
  airblastRadius: number;
  thermalRadius: number;
  casualties: number;
  description: string;
  comparison: string;
}

const AsteroidLauncher = () => {
  const navigate = useNavigate();
  const [diameter, setDiameter] = useState([100]); // metri
  const [velocity, setVelocity] = useState([20]); // km/s
  const [angle, setAngle] = useState([45]); // gradi
  const [launched, setLaunched] = useState(false);
  const [impactResults, setImpactResults] = useState<ImpactResults | null>(null);
  const [totalLaunches, setTotalLaunches] = useState(0);

  const calculateAsteroidData = (): AsteroidData => {
    const d = diameter[0];
    const v = velocity[0] * 1000; // conversione in m/s
    const density = 2600; // kg/m³ (densità media di un asteroide roccioso)
    const volume = (4/3) * Math.PI * Math.pow(d/2, 3);
    const mass = volume * density;
    const energy = 0.5 * mass * Math.pow(v, 2); // energia cinetica in Joule
    
    return { diameter: d, velocity: velocity[0], mass, energy };
  };

  const calculateImpact = (asteroidData: AsteroidData): ImpactResults => {
    const { diameter: d, energy } = asteroidData;
    
    // Calcoli semplificati basati su formule scientifiche reali
    const energyMegatons = energy / (4.184 * Math.pow(10, 15)); // conversione in megatoni TNT
    
    // Diametro cratere (formula di Holsapple & Housen)
    const craterDiameter = 1.8 * Math.pow(energyMegatons, 0.25) * 1000; // metri
    
    // Magnitudo terremoto
    const earthquakeMagnitude = Math.min(10, 0.67 * Math.log10(energyMegatons) + 2.9);
    
    // Raggio dell'onda d'urto aerea (km)
    const airblastRadius = Math.pow(energyMegatons / 1000, 1/3) * 10;
    
    // Raggio effetti termici (km)
    const thermalRadius = Math.pow(energyMegatons, 0.4) * 2;
    
    // Stima vittime (molto approssimativa)
    const affectedArea = Math.PI * Math.pow(Math.max(airblastRadius, thermalRadius), 2);
    const populationDensity = 50; // persone per km²
    const casualties = Math.floor(affectedArea * populationDensity * 0.5);
    
    // Descrizione dell'impatto
    let description = '';
    let comparison = '';
    
    if (energyMegatons < 0.001) {
      description = 'Impatto minimo. L\'asteroide si disintegra nell\'atmosfera.';
      comparison = 'Simile a un piccolo meteorite.';
    } else if (energyMegatons < 0.1) {
      description = 'Impatto locale. Danni limitati alla zona immediata.';
      comparison = 'Equivalente a una piccola bomba.';
    } else if (energyMegatons < 10) {
      description = 'Impatto significativo. Distruzione di una piccola città.';
      comparison = 'Simile alla bomba di Hiroshima.';
    } else if (energyMegatons < 1000) {
      description = 'Impatto devastante. Distruzione regionale.';
      comparison = 'Equivalente alle più potenti armi nucleari.';
    } else if (energyMegatons < 100000) {
      description = 'Impatto catastrofico. Effetti globali significativi.';
      comparison = 'Simile all\'evento di Tunguska (1908).';
    } else {
      description = 'Estinzione di massa. Cambiamenti climatici permanenti.';
      comparison = 'Simile all\'impatto che uccise i dinosauri.';
    }
    
    return {
      craterDiameter,
      earthquakeMagnitude,
      airblastRadius,
      thermalRadius,
      casualties,
      description,
      comparison
    };
  };

  const launchAsteroid = () => {
    const asteroidData = calculateAsteroidData();
    const results = calculateImpact(asteroidData);
    
    setImpactResults(results);
    setLaunched(true);
    setTotalLaunches(prev => prev + 1);
    
    // Save stats
    const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    stats.asteroidLauncher = {
      totalLaunches: (stats.asteroidLauncher?.totalLaunches || 0) + 1,
      biggestImpact: Math.max(stats.asteroidLauncher?.biggestImpact || 0, asteroidData.energy),
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('gameStats', JSON.stringify(stats));
    
    toast.success('Asteroide lanciato! Impatto calcolato.');
  };

  const resetLauncher = () => {
    setLaunched(false);
    setImpactResults(null);
  };

  const asteroidData = calculateAsteroidData();
  const energyMegatons = asteroidData.energy / (4.184 * Math.pow(10, 15));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-4xl mx-auto">
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
            Asteroid Launcher
          </h1>
          <p className="text-muted-foreground">
            Progetta un asteroide e scopri quali danni causerebbe impattando sulla Terra!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configurazione Asteroide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Diametro: {diameter[0]} metri
                </label>
                <Slider
                  value={diameter}
                  onValueChange={setDiameter}
                  max={10000}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1m</span>
                  <span>10km</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Velocità: {velocity[0]} km/s
                </label>
                <Slider
                  value={velocity}
                  onValueChange={setVelocity}
                  max={70}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 km/s</span>
                  <span>70 km/s</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Angolo di impatto: {angle[0]}°
                </label>
                <Slider
                  value={angle}
                  onValueChange={setAngle}
                  max={90}
                  min={15}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15°</span>
                  <span>90°</span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Dati Asteroide:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Massa:</span>
                  <span className="font-mono">{(asteroidData.mass / 1000).toExponential(2)} kg</span>
                  <span>Energia:</span>
                  <span className="font-mono">{energyMegatons.toExponential(2)} MT</span>
                </div>
              </div>

              <Button
                onClick={launchAsteroid}
                className="w-full h-12 text-lg"
                disabled={launched}
              >
                <Zap className="h-5 w-5 mr-2" />
                {launched ? 'Impatto Completato' : 'Lancia Asteroide!'}
              </Button>

              {launched && (
                <Button
                  onClick={resetLauncher}
                  variant="outline"
                  className="w-full"
                >
                  Nuovo Lancio
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Risultati Impatto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!launched ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Configura l'asteroide e clicca "Lancia" per vedere i risultati dell'impatto.</p>
                </div>
              ) : impactResults ? (
                <div className="space-y-4">
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <h4 className="font-semibold text-destructive mb-2">Descrizione dell'Impatto</h4>
                    <p className="text-sm mb-2">{impactResults.description}</p>
                    <p className="text-xs text-muted-foreground">{impactResults.comparison}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Cratere</h5>
                      <p className="text-lg font-bold">{impactResults.craterDiameter.toFixed(0)}m</p>
                      <p className="text-xs text-muted-foreground">Diametro</p>
                    </div>

                    <div className="bg-muted p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Terremoto</h5>
                      <p className="text-lg font-bold">{impactResults.earthquakeMagnitude.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Magnitudo</p>
                    </div>

                    <div className="bg-muted p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Onda d'urto</h5>
                      <p className="text-lg font-bold">{impactResults.airblastRadius.toFixed(1)} km</p>
                      <p className="text-xs text-muted-foreground">Raggio</p>
                    </div>

                    <div className="bg-muted p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Effetti termici</h5>
                      <p className="text-lg font-bold">{impactResults.thermalRadius.toFixed(1)} km</p>
                      <p className="text-xs text-muted-foreground">Raggio</p>
                    </div>
                  </div>

                  <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/10">
                    <h5 className="font-medium text-sm mb-2">Vittime Stimate</h5>
                    <p className="text-2xl font-bold text-destructive">
                      {impactResults.casualties.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stima basata su densità di popolazione media
                    </p>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline" className="text-lg p-2">
                      Lanci totali: {totalLaunches}
                    </Badge>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informazioni Scientifiche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-2">Scala di Riferimento:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Meteorite di Chelyabinsk (2013): ~20m, 0.5 MT</li>
                  <li>• Evento di Tunguska (1908): ~60m, 10-15 MT</li>
                  <li>• Impatto K-Pg (dinosauri): ~10km, 100M MT</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Note sui Calcoli:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Densità asteroide: 2.6 g/cm³</li>
                  <li>• Formule basate su ricerca scientifica</li>
                  <li>• Risultati sono stime approssimative</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AsteroidLauncher;