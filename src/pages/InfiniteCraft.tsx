import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Element {
  id: string;
  name: string;
  discovered: boolean;
  emoji: string;
}

interface Recipe {
  ingredients: string[];
  result: string;
}

const InfiniteCraft = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [discoveredElements, setDiscoveredElements] = useState<Element[]>([]);
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [totalDiscovered, setTotalDiscovered] = useState(0);

  const baseElements: Element[] = [
    { id: 'fire', name: 'Fuoco', discovered: true, emoji: '🔥' },
    { id: 'water', name: 'Acqua', discovered: true, emoji: '💧' },
    { id: 'earth', name: 'Terra', discovered: true, emoji: '🌍' },
    { id: 'air', name: 'Aria', discovered: true, emoji: '💨' }
  ];

  const recipes: Recipe[] = [
    { ingredients: ['fire', 'water'], result: 'steam' },
    { ingredients: ['fire', 'earth'], result: 'lava' },
    { ingredients: ['water', 'earth'], result: 'mud' },
    { ingredients: ['air', 'water'], result: 'cloud' },
    { ingredients: ['air', 'fire'], result: 'smoke' },
    { ingredients: ['earth', 'air'], result: 'dust' },
    { ingredients: ['steam', 'air'], result: 'rain' },
    { ingredients: ['lava', 'water'], result: 'stone' },
    { ingredients: ['mud', 'fire'], result: 'brick' },
    { ingredients: ['cloud', 'fire'], result: 'lightning' },
    { ingredients: ['smoke', 'water'], result: 'fog' },
    { ingredients: ['dust', 'water'], result: 'clay' },
    { ingredients: ['rain', 'earth'], result: 'plant' },
    { ingredients: ['stone', 'fire'], result: 'metal' },
    { ingredients: ['brick', 'brick'], result: 'wall' },
    { ingredients: ['lightning', 'tree'], result: 'fire' },
    { ingredients: ['plant', 'water'], result: 'tree' },
    { ingredients: ['tree', 'fire'], result: 'ash' },
    { ingredients: ['metal', 'fire'], result: 'blade' },
    { ingredients: ['clay', 'fire'], result: 'pottery' },
    { ingredients: ['stone', 'stone'], result: 'mountain' },
    { ingredients: ['tree', 'tree'], result: 'forest' },
    { ingredients: ['water', 'water'], result: 'lake' },
    { ingredients: ['mountain', 'fire'], result: 'volcano' },
    { ingredients: ['forest', 'fire'], result: 'wildfire' },
    { ingredients: ['lake', 'air'], result: 'wave' },
    { ingredients: ['blade', 'tree'], result: 'wood' },
    { ingredients: ['wood', 'fire'], result: 'charcoal' },
    { ingredients: ['volcano', 'water'], result: 'island' },
    { ingredients: ['wave', 'earth'], result: 'beach' },
    { ingredients: ['charcoal', 'earth'], result: 'diamond' },
    { ingredients: ['island', 'plant'], result: 'jungle' },
    { ingredients: ['beach', 'water'], result: 'ocean' },
    { ingredients: ['diamond', 'fire'], result: 'star' },
    { ingredients: ['jungle', 'water'], result: 'swamp' },
    { ingredients: ['ocean', 'fire'], result: 'salt' },
    { ingredients: ['star', 'star'], result: 'galaxy' },
    { ingredients: ['swamp', 'earth'], result: 'quicksand' },
    { ingredients: ['salt', 'water'], result: 'brine' },
    { ingredients: ['galaxy', 'earth'], result: 'planet' },
    { ingredients: ['planet', 'water'], result: 'life' },
    { ingredients: ['life', 'earth'], result: 'human' },
    { ingredients: ['human', 'fire'], result: 'civilization' },
    { ingredients: ['civilization', 'stone'], result: 'city' },
    { ingredients: ['city', 'air'], result: 'sky' },
    { ingredients: ['sky', 'water'], result: 'rainbow' }
  ];

  const allElements: Record<string, Element> = {
    fire: { id: 'fire', name: 'Fuoco', discovered: true, emoji: '🔥' },
    water: { id: 'water', name: 'Acqua', discovered: true, emoji: '💧' },
    earth: { id: 'earth', name: 'Terra', discovered: true, emoji: '🌍' },
    air: { id: 'air', name: 'Aria', discovered: true, emoji: '💨' },
    steam: { id: 'steam', name: 'Vapore', discovered: false, emoji: '♨️' },
    lava: { id: 'lava', name: 'Lava', discovered: false, emoji: '🌋' },
    mud: { id: 'mud', name: 'Fango', discovered: false, emoji: '🟤' },
    cloud: { id: 'cloud', name: 'Nuvola', discovered: false, emoji: '☁️' },
    smoke: { id: 'smoke', name: 'Fumo', discovered: false, emoji: '💨' },
    dust: { id: 'dust', name: 'Polvere', discovered: false, emoji: '🌪️' },
    rain: { id: 'rain', name: 'Pioggia', discovered: false, emoji: '🌧️' },
    stone: { id: 'stone', name: 'Pietra', discovered: false, emoji: '🪨' },
    brick: { id: 'brick', name: 'Mattone', discovered: false, emoji: '🧱' },
    lightning: { id: 'lightning', name: 'Fulmine', discovered: false, emoji: '⚡' },
    fog: { id: 'fog', name: 'Nebbia', discovered: false, emoji: '🌫️' },
    clay: { id: 'clay', name: 'Argilla', discovered: false, emoji: '🏺' },
    plant: { id: 'plant', name: 'Pianta', discovered: false, emoji: '🌱' },
    metal: { id: 'metal', name: 'Metallo', discovered: false, emoji: '⚙️' },
    wall: { id: 'wall', name: 'Muro', discovered: false, emoji: '🧱' },
    tree: { id: 'tree', name: 'Albero', discovered: false, emoji: '🌳' },
    ash: { id: 'ash', name: 'Cenere', discovered: false, emoji: '⚱️' },
    blade: { id: 'blade', name: 'Lama', discovered: false, emoji: '🗡️' },
    pottery: { id: 'pottery', name: 'Ceramica', discovered: false, emoji: '🏺' },
    mountain: { id: 'mountain', name: 'Montagna', discovered: false, emoji: '⛰️' },
    forest: { id: 'forest', name: 'Foresta', discovered: false, emoji: '🌲' },
    lake: { id: 'lake', name: 'Lago', discovered: false, emoji: '🏞️' },
    volcano: { id: 'volcano', name: 'Vulcano', discovered: false, emoji: '🌋' },
    wildfire: { id: 'wildfire', name: 'Incendio', discovered: false, emoji: '🔥' },
    wave: { id: 'wave', name: 'Onda', discovered: false, emoji: '🌊' },
    wood: { id: 'wood', name: 'Legno', discovered: false, emoji: '🪵' },
    charcoal: { id: 'charcoal', name: 'Carbone', discovered: false, emoji: '⚫' },
    island: { id: 'island', name: 'Isola', discovered: false, emoji: '🏝️' },
    beach: { id: 'beach', name: 'Spiaggia', discovered: false, emoji: '🏖️' },
    diamond: { id: 'diamond', name: 'Diamante', discovered: false, emoji: '💎' },
    jungle: { id: 'jungle', name: 'Giungla', discovered: false, emoji: '🌴' },
    ocean: { id: 'ocean', name: 'Oceano', discovered: false, emoji: '🌊' },
    star: { id: 'star', name: 'Stella', discovered: false, emoji: '⭐' },
    swamp: { id: 'swamp', name: 'Palude', discovered: false, emoji: '🐊' },
    salt: { id: 'salt', name: 'Sale', discovered: false, emoji: '🧂' },
    galaxy: { id: 'galaxy', name: 'Galassia', discovered: false, emoji: '🌌' },
    quicksand: { id: 'quicksand', name: 'Sabbie Mobili', discovered: false, emoji: '⏳' },
    brine: { id: 'brine', name: 'Salamoia', discovered: false, emoji: '🧂' },
    planet: { id: 'planet', name: 'Pianeta', discovered: false, emoji: '🪐' },
    life: { id: 'life', name: 'Vita', discovered: false, emoji: '🧬' },
    human: { id: 'human', name: 'Umano', discovered: false, emoji: '👤' },
    civilization: { id: 'civilization', name: 'Civiltà', discovered: false, emoji: '🏛️' },
    city: { id: 'city', name: 'Città', discovered: false, emoji: '🏙️' },
    sky: { id: 'sky', name: 'Cielo', discovered: false, emoji: '🌌' },
    rainbow: { id: 'rainbow', name: 'Arcobaleno', discovered: false, emoji: '🌈' }
  };

  useEffect(() => {
    const saved = localStorage.getItem('infiniteCraftProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      setDiscoveredElements(progress.discovered || baseElements);
      setTotalDiscovered(progress.total || 4);
    } else {
      setDiscoveredElements(baseElements);
      setTotalDiscovered(4);
    }
  }, []);

  const saveProgress = (discovered: Element[], total: number) => {
    localStorage.setItem('infiniteCraftProgress', JSON.stringify({
      discovered,
      total
    }));
  };

  const handleElementClick = (element: Element) => {
    if (selectedElements.length < 2) {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const clearSelection = () => {
    setSelectedElements([]);
  };

  const tryCombination = () => {
    if (selectedElements.length !== 2) return;

    const [elem1, elem2] = selectedElements;
    const combination1 = [elem1.id, elem2.id].sort();
    const combination2 = [elem2.id, elem1.id].sort();

    const recipe = recipes.find(r => {
      const sortedIngredients = r.ingredients.sort();
      return JSON.stringify(sortedIngredients) === JSON.stringify(combination1) ||
             JSON.stringify(sortedIngredients) === JSON.stringify(combination2);
    });

    if (recipe && allElements[recipe.result]) {
      const newElement = { ...allElements[recipe.result], discovered: true };
      const isNewDiscovery = !discoveredElements.some(e => e.id === newElement.id);
      
      if (isNewDiscovery) {
        const updatedDiscovered = [...discoveredElements, newElement];
        const newTotal = totalDiscovered + 1;
        setDiscoveredElements(updatedDiscovered);
        setTotalDiscovered(newTotal);
        saveProgress(updatedDiscovered, newTotal);
        toast.success(`Nuovo elemento scoperto: ${newElement.emoji} ${newElement.name}!`);
        
        // Save stats
        const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
        stats.infiniteCraft = {
          elementsDiscovered: newTotal,
          lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('gameStats', JSON.stringify(stats));
      } else {
        toast.info(`Hai ricombinato: ${newElement.emoji} ${newElement.name}`);
      }
    } else {
      toast.error('Questa combinazione non funziona!');
    }

    setSelectedElements([]);
  };

  const resetGame = () => {
    setDiscoveredElements(baseElements);
    setTotalDiscovered(4);
    setSelectedElements([]);
    localStorage.removeItem('infiniteCraftProgress');
    toast.success('Gioco resettato!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Infinite Craft
          </h1>
          <p className="text-muted-foreground mb-4">
            Combina elementi per scoprirne di nuovi! Inizia con i 4 elementi base.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-lg p-2">
              Elementi scoperti: {totalDiscovered}
            </Badge>
            <Badge variant="outline" className="text-lg p-2">
              Possibili: {Object.keys(allElements).length}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Elementi Scoperti</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetGame}
                  className="text-destructive hover:text-destructive"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {discoveredElements.map((element) => (
                  <Button
                    key={element.id}
                    variant={selectedElements.some(e => e.id === element.id) ? "default" : "outline"}
                    onClick={() => handleElementClick(element)}
                    className="h-16 flex flex-col items-center justify-center text-xs"
                    disabled={selectedElements.length >= 2 && !selectedElements.some(e => e.id === element.id)}
                  >
                    <span className="text-lg mb-1">{element.emoji}</span>
                    <span>{element.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laboratorio di Combinazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 h-24">
                  {selectedElements.map((element, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl mb-1">{element.emoji}</div>
                      <div className="text-sm">{element.name}</div>
                    </div>
                  ))}
                  {selectedElements.length === 1 && (
                    <>
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">?</span>
                      </div>
                    </>
                  )}
                  {selectedElements.length === 0 && (
                    <div className="text-center text-muted-foreground">
                      <div className="text-sm">Seleziona due elementi per combinarli</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={tryCombination}
                    disabled={selectedElements.length !== 2}
                    className="flex-1"
                  >
                    Combina
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearSelection}
                    disabled={selectedElements.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {selectedElements.length === 2 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Stai combinando: {selectedElements[0].name} + {selectedElements[1].name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suggerimenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>🔥 + 💧 = ♨️</strong><br />
                Fuoco + Acqua = Vapore
              </div>
              <div>
                <strong>🌍 + 💧 = 🟤</strong><br />
                Terra + Acqua = Fango
              </div>
              <div>
                <strong>🔥 + 🌍 = 🌋</strong><br />
                Fuoco + Terra = Lava
              </div>
              <div>
                <strong>💨 + 💧 = ☁️</strong><br />
                Aria + Acqua = Nuvola
              </div>
              <div>
                <strong>⚡ + 🌳 = 🔥</strong><br />
                Fulmine + Albero = Fuoco
              </div>
              <div className="text-muted-foreground">
                ...e molte altre combinazioni da scoprire!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfiniteCraft;