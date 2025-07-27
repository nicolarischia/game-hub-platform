import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Rule {
  id: number;
  text: string;
  check: (password: string) => boolean;
  completed: boolean;
}

const PasswordGame = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const rules: Rule[] = [
    {
      id: 1,
      text: "La password deve essere lunga almeno 5 caratteri",
      check: (pwd) => pwd.length >= 5,
      completed: false
    },
    {
      id: 2,
      text: "La password deve contenere un numero",
      check: (pwd) => /\d/.test(pwd),
      completed: false
    },
    {
      id: 3,
      text: "La password deve contenere una lettera maiuscola",
      check: (pwd) => /[A-Z]/.test(pwd),
      completed: false
    },
    {
      id: 4,
      text: "La password deve contenere un carattere speciale",
      check: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
      completed: false
    },
    {
      id: 5,
      text: "La password deve contenere la parola 'password'",
      check: (pwd) => pwd.toLowerCase().includes('password'),
      completed: false
    },
    {
      id: 6,
      text: "La password deve essere lunga almeno 20 caratteri",
      check: (pwd) => pwd.length >= 20,
      completed: false
    },
    {
      id: 7,
      text: "La password deve contenere un emoji",
      check: (pwd) => /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(pwd),
      completed: false
    },
    {
      id: 8,
      text: "La password deve contenere il numero 42",
      check: (pwd) => pwd.includes('42'),
      completed: false
    },
    {
      id: 9,
      text: "La password deve contenere un mese dell'anno",
      check: (pwd) => {
        const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 
                       'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
        return months.some(month => pwd.toLowerCase().includes(month));
      },
      completed: false
    },
    {
      id: 10,
      text: "La password deve terminare con '!'",
      check: (pwd) => pwd.endsWith('!'),
      completed: false
    }
  ];

  const [currentRules, setCurrentRules] = useState<Rule[]>([rules[0]]);

  useEffect(() => {
    updateRules();
  }, [password]);

  const updateRules = () => {
    const updatedRules = currentRules.map(rule => ({
      ...rule,
      completed: rule.check(password)
    }));

    setCurrentRules(updatedRules);

    const allCompleted = updatedRules.every(rule => rule.completed);
    if (allCompleted && currentRule <= rules.length) {
      if (currentRule === rules.length) {
        setGameWon(true);
        toast.success('Congratulazioni! Hai completato il Password Game!');
        saveStats();
      } else {
        setTimeout(() => {
          setCurrentRule(prev => prev + 1);
          setCurrentRules(rules.slice(0, currentRule + 1));
          toast.success(`Regola ${currentRule} completata! Nuova regola sbloccata!`);
        }, 500);
      }
    }
  };

  const saveStats = () => {
    const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    stats.passwordGame = {
      gamesPlayed: (stats.passwordGame?.gamesPlayed || 0) + 1,
      gamesWon: (stats.passwordGame?.gamesWon || 0) + 1,
      bestAttempts: Math.min(stats.passwordGame?.bestAttempts || Infinity, attempts),
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('gameStats', JSON.stringify(stats));
  };

  const resetGame = () => {
    setPassword('');
    setCurrentRule(1);
    setCurrentRules([rules[0]]);
    setGameWon(false);
    setAttempts(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Password Game
          </h1>
          <p className="text-muted-foreground">
            Crea una password che soddisfi tutte le regole sempre più complesse!
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Password (Regola {currentRule}/{rules.length})</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inizia a scrivere la tua password..."
                className="text-lg p-4"
                disabled={gameWon}
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Lunghezza: {password.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {currentRules.map((rule) => (
            <Card key={rule.id} className={`transition-all duration-300 ${
              rule.completed ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-destructive bg-red-50 dark:bg-red-950'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="flex-1">{rule.text}</span>
                  <Badge variant={rule.completed ? "default" : "destructive"}>
                    {rule.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {gameWon && (
          <Card className="mt-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                🎉 Complimenti!
              </h3>
              <p className="text-green-600 dark:text-green-400 mb-4">
                Hai completato tutte le regole del Password Game!
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Tentativi: {attempts + 1}
              </p>
              <Button onClick={resetGame} className="w-full">
                Gioca Ancora
              </Button>
            </CardContent>
          </Card>
        )}

        {!gameWon && (
          <div className="mt-6 text-center">
            <Button onClick={resetGame} variant="outline">
              Ricomincia
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGame;