import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, TrendingDown, DollarSign, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  description: string;
  emoji: string;
  startingPrice: number;
  currentPrice: number;
  timeLeft: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Bid {
  amount: number;
  timestamp: number;
}

const AuctionGame = () => {
  const navigate = useNavigate();
  const [money, setMoney] = useState(10000);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [bids, setBids] = useState<Bid[]>([]);
  const [itemsSold, setItemsSold] = useState(0);
  const [profit, setProfit] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const items: Item[] = [
    {
      id: '1',
      name: 'Quadro Vintage',
      description: 'Un dipinto del 1800 di un artista sconosciuto',
      emoji: '🖼️',
      startingPrice: 500,
      currentPrice: 500,
      timeLeft: 30,
      category: 'Arte',
      rarity: 'rare'
    },
    {
      id: '2',
      name: 'Orologio da Tasca',
      description: 'Orologio meccanico in oro del 1920',
      emoji: '⌚',
      startingPrice: 800,
      currentPrice: 800,
      timeLeft: 25,
      category: 'Antiquariato',
      rarity: 'epic'
    },
    {
      id: '3',
      name: 'Violino Antico',
      description: 'Violino artigianale italiano del XVIII secolo',
      emoji: '🎻',
      startingPrice: 2000,
      currentPrice: 2000,
      timeLeft: 40,
      category: 'Strumenti',
      rarity: 'legendary'
    },
    {
      id: '4',
      name: 'Vaso di Ceramica',
      description: 'Vaso decorativo orientale',
      emoji: '🏺',
      startingPrice: 200,
      currentPrice: 200,
      timeLeft: 20,
      category: 'Ceramica',
      rarity: 'common'
    },
    {
      id: '5',
      name: 'Libro Raro',
      description: 'Prima edizione di un romanzo classico',
      emoji: '📚',
      startingPrice: 1200,
      currentPrice: 1200,
      timeLeft: 35,
      category: 'Libri',
      rarity: 'epic'
    },
    {
      id: '6',
      name: 'Moneta Antica',
      description: 'Moneta romana del I secolo d.C.',
      emoji: '🪙',
      startingPrice: 300,
      currentPrice: 300,
      timeLeft: 15,
      category: 'Numismatica',
      rarity: 'rare'
    },
    {
      id: '7',
      name: 'Gioiello Vintage',
      description: 'Collana con diamanti degli anni \'50',
      emoji: '💎',
      startingPrice: 3000,
      currentPrice: 3000,
      timeLeft: 45,
      category: 'Gioielli',
      rarity: 'legendary'
    },
    {
      id: '8',
      name: 'Scultura in Bronzo',
      description: 'Piccola scultura di un artista emergente',
      emoji: '🗿',
      startingPrice: 600,
      currentPrice: 600,
      timeLeft: 30,
      category: 'Scultura',
      rarity: 'rare'
    }
  ];

  const generateRandomItem = (): Item => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const priceVariation = 0.7 + Math.random() * 0.6; // ±30% variation
    const timeVariation = 15 + Math.random() * 30; // 15-45 seconds
    
    return {
      ...randomItem,
      id: Math.random().toString(),
      startingPrice: Math.floor(randomItem.startingPrice * priceVariation),
      currentPrice: Math.floor(randomItem.startingPrice * priceVariation),
      timeLeft: Math.floor(timeVariation)
    };
  };

  const startNewAuction = () => {
    const newItem = generateRandomItem();
    setCurrentItem(newItem);
    setTimeLeft(newItem.timeLeft);
    setBids([]);
    setBidAmount('');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getItemValue = (item: Item): number => {
    const baseValue = item.startingPrice;
    const rarityMultiplier = {
      common: 1.2,
      rare: 1.5,
      epic: 2.0,
      legendary: 3.0
    };
    return Math.floor(baseValue * rarityMultiplier[item.rarity]);
  };

  const simulateOtherBidders = () => {
    if (!currentItem || timeLeft <= 0) return;
    
    // 30% chance ogni secondo che qualcuno faccia un'offerta
    if (Math.random() < 0.3) {
      const increment = Math.floor(currentItem.currentPrice * (0.05 + Math.random() * 0.1)); // 5-15% increment
      const newPrice = currentItem.currentPrice + increment;
      
      if (newPrice < money * 2) { // Gli altri bidders non vanno oltre il doppio dei nostri soldi
        setCurrentItem(prev => prev ? { ...prev, currentPrice: newPrice } : null);
        setBids(prev => [...prev, { amount: newPrice, timestamp: Date.now() }]);
      }
    }
  };

  const placeBid = () => {
    if (!currentItem || timeLeft <= 0) return;
    
    const bidValue = parseInt(bidAmount);
    if (isNaN(bidValue) || bidValue <= currentItem.currentPrice) {
      toast.error('L\'offerta deve essere superiore al prezzo attuale!');
      return;
    }
    
    if (bidValue > money) {
      toast.error('Non hai abbastanza soldi!');
      return;
    }
    
    setCurrentItem(prev => prev ? { ...prev, currentPrice: bidValue } : null);
    setBids(prev => [...prev, { amount: bidValue, timestamp: Date.now() }]);
    setBidAmount('');
    toast.success(`Offerta di €${bidValue} piazzata!`);
  };

  const endAuction = () => {
    if (!currentItem) return;
    
    const lastBid = bids[bids.length - 1];
    const wonAuction = lastBid && bids.filter(bid => bid.timestamp === lastBid.timestamp).length === 1;
    
    if (wonAuction) {
      const itemValue = getItemValue(currentItem);
      const paidPrice = currentItem.currentPrice;
      const profitLoss = itemValue - paidPrice;
      
      setMoney(prev => prev - paidPrice + itemValue);
      setProfit(prev => prev + profitLoss);
      setItemsSold(prev => prev + 1);
      
      if (profitLoss > 0) {
        toast.success(`Hai vinto! Venduto per €${itemValue}. Profitto: €${profitLoss}`);
      } else {
        toast.error(`Hai vinto ma perso €${Math.abs(profitLoss)}. L'oggetto valeva solo €${itemValue}`);
      }
      
      // Save stats
      const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
      stats.auctionGame = {
        itemsWon: (stats.auctionGame?.itemsWon || 0) + 1,
        totalProfit: (stats.auctionGame?.totalProfit || 0) + profitLoss,
        bestProfit: Math.max(stats.auctionGame?.bestProfit || 0, profitLoss),
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem('gameStats', JSON.stringify(stats));
    } else {
      toast.info('Hai perso l\'asta. Nessun costo sostenuto.');
    }
    
    if (money <= 0) {
      setGameOver(true);
      toast.error('Game Over! Hai finito i soldi!');
      return;
    }
    
    setTimeout(() => {
      startNewAuction();
    }, 3000);
  };

  const resetGame = () => {
    setMoney(10000);
    setProfit(0);
    setItemsSold(0);
    setGameOver(false);
    startNewAuction();
  };

  useEffect(() => {
    startNewAuction();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        simulateOtherBidders();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentItem) {
      endAuction();
    }
  }, [timeLeft, gameOver, currentItem]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-muted-foreground mb-4">
              Hai terminato i soldi disponibili.
            </p>
            <div className="space-y-2 mb-6">
              <p>Oggetti acquistati: {itemsSold}</p>
              <p className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                Profitto totale: €{profit}
              </p>
            </div>
            <Button onClick={resetGame} className="w-full">
              Gioca Ancora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            The Auction Game
          </h1>
          <p className="text-muted-foreground">
            Partecipa alle aste e prova a comprare oggetti di valore per rivenderli!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">€{money.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Soldi disponibili</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{itemsSold}</p>
              <p className="text-sm text-muted-foreground">Oggetti acquistati</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {profit >= 0 ? (
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-600" />
              )}
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{profit.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Profitto totale</p>
            </CardContent>
          </Card>
        </div>

        {currentItem && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-3xl">{currentItem.emoji}</span>
                  <div>
                    <div>{currentItem.name}</div>
                    <Badge className={getRarityColor(currentItem.rarity)}>
                      {currentItem.rarity}
                    </Badge>
                  </div>
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <Clock className="h-5 w-5" />
                    {timeLeft}s
                  </div>
                  <Progress value={(timeLeft / currentItem.timeLeft) * 100} className="w-24" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-4">{currentItem.description}</p>
                  <div className="space-y-2">
                    <p><strong>Categoria:</strong> {currentItem.category}</p>
                    <p><strong>Prezzo di partenza:</strong> €{currentItem.startingPrice.toLocaleString()}</p>
                    <p><strong>Valore stimato:</strong> €{getItemValue(currentItem).toLocaleString()}</p>
                    <p className="text-2xl font-bold text-primary">
                      Offerta attuale: €{currentItem.currentPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: €${currentItem.currentPrice + 1}`}
                      min={currentItem.currentPrice + 1}
                      max={money}
                      disabled={timeLeft <= 0}
                    />
                    <Button 
                      onClick={placeBid}
                      disabled={timeLeft <= 0 || !bidAmount}
                    >
                      Offri
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentItem.currentPrice + 50).toString())}
                      disabled={timeLeft <= 0}
                    >
                      +€50
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentItem.currentPrice + 100).toString())}
                      disabled={timeLeft <= 0}
                    >
                      +€100
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentItem.currentPrice + 500).toString())}
                      disabled={timeLeft <= 0}
                    >
                      +€500
                    </Button>
                  </div>
                  
                  {bids.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Ultime offerte:</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {bids.slice(-5).reverse().map((bid, index) => (
                          <div key={index} className="text-sm bg-muted p-2 rounded">
                            €{bid.amount.toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuctionGame;