import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Gamepad2, Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message || 'Errore durante il login');
    } else {
      toast.success('Login effettuato con successo!');
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    const { error } = await signUp(email, password, username);
    
    if (error) {
      if (error.message?.includes('already registered')) {
        toast.error('Email già registrata. Prova a fare il login.');
      } else {
        toast.error(error.message || 'Errore durante la registrazione');
      }
    } else {
      toast.success('Registrazione completata! Controlla la tua email per confermare l\'account.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen hero-section flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
        
        <Card className="glass-effect glow-effect relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl glow-effect floating-animation">
                <Gamepad2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
              GameHub
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Accedi al tuo account o creane uno nuovo per salvare i tuoi progressi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-effect">
                <TabsTrigger value="login" className="text-lg py-3">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-lg py-3">Registrati</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-8">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="login-email" className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email
                    </label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="nome@esempio.com"
                      className="h-12 text-lg glass-effect"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="login-password" className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Password
                    </label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="h-12 text-lg glass-effect"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full game-button text-lg py-4 h-14" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Accesso in corso...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Accedi
                      </div>
                    )}
                  </Button>
              </form>
            </TabsContent>
            
              <TabsContent value="signup" className="mt-8">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="signup-username" className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Username
                    </label>
                    <Input
                      id="signup-username"
                      name="username"
                      type="text"
                      placeholder="Il tuo username"
                      className="h-12 text-lg glass-effect"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="signup-email" className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="nome@esempio.com"
                      className="h-12 text-lg glass-effect"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="signup-password" className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Password (min. 6 caratteri)"
                      className="h-12 text-lg glass-effect"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full game-button text-lg py-4 h-14" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Registrazione in corso...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Registrati
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-lg px-6 py-3 glass-effect hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Torna alla Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;