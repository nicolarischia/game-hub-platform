import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Shuffle, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const whatIfQuestions = [
  "E se i gatti governassero il mondo?",
  "E se potessi volare ma solo all'indietro?",
  "E se la gravità funzionasse al contrario per un giorno?",
  "E se tutti parlassero solo in rima?",
  "E se gli alberi potessero camminare?",
  "E se il cioccolato crescesse sugli alberi?",
  "E se potessi leggere nel pensiero dei cani?",
  "E se i colori avessero un sapore?",
  "E se potessi fermere il tempo per 10 secondi al giorno?",
  "E se gli smartphone non fossero mai stati inventati?",
  "E se potessi comunicare con i pesci?",
  "E se la pioggia fosse colorata?",
  "E se potessi trasformarti in qualsiasi animale per un'ora?",
  "E se il mondo fosse fatto di LEGO?",
  "E se potessi viaggiare nel tempo ma solo di 5 minuti?"
];

const WhatIfGame = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userComment, setUserComment] = useState("");
  const [responses, setResponses] = useState<Array<{question: string, response: string, comment?: string}>>([]);
  const [showComment, setShowComment] = useState(false);

  // Carica le risposte dal localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem('whatif-responses');
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
    generateNewQuestion();
  }, []);

  // Salva le risposte nel localStorage
  useEffect(() => {
    if (responses.length > 0) {
      localStorage.setItem('whatif-responses', JSON.stringify(responses));
    }
  }, [responses]);

  const generateNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * whatIfQuestions.length);
    setCurrentQuestion(whatIfQuestions[randomIndex]);
    setShowComment(false);
    setUserComment("");
  };

  const handleResponse = (response: string) => {
    const newResponse = {
      question: currentQuestion,
      response,
      comment: userComment || undefined
    };
    
    setResponses(prev => [newResponse, ...prev.slice(0, 9)]); // Mantieni solo le ultime 10 risposte
    
    if (showComment && userComment) {
      generateNewQuestion();
    } else if (!showComment) {
      setShowComment(true);
    }
  };

  const clearHistory = () => {
    setResponses([]);
    localStorage.removeItem('whatif-responses');
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
            What If Generator
          </h1>
          <div></div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Card */}
          <div className="space-y-6">
            <Card className="game-card">
              <div className="text-center space-y-6">
                <div className="text-4xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-card-foreground fade-in">
                  {currentQuestion}
                </h2>
                
                {!showComment ? (
                  <div className="flex justify-center gap-4">
                    <Button
                      className="game-button flex items-center gap-2"
                      onClick={() => handleResponse("Sì")}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Sì
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 hover:scale-105 transition-transform"
                      onClick={() => handleResponse("No")}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      No
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2 hover:scale-105 transition-transform"
                      onClick={() => setShowComment(true)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Commenta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Scrivi il tuo commento o la tua risposta..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-3">
                      <Button
                        className="game-button flex-1"
                        onClick={() => handleResponse("Commento")}
                        disabled={!userComment.trim()}
                      >
                        Invia Risposta
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowComment(false)}
                      >
                        Annulla
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  variant="secondary"
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                  onClick={generateNewQuestion}
                >
                  <Shuffle className="w-4 h-4" />
                  Nuova Domanda
                </Button>
              </div>
            </Card>
          </div>

          {/* History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Le tue risposte</h3>
              {responses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                >
                  Cancella tutto
                </Button>
              )}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {responses.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>Le tue risposte appariranno qui</p>
                </Card>
              ) : (
                responses.map((item, index) => (
                  <Card key={index} className="p-4 fade-in">
                    <p className="font-medium text-sm mb-2">{item.question}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.response === 'Sì' ? 'bg-green-100 text-green-800' :
                        item.response === 'No' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.response}
                      </span>
                    </div>
                    {item.comment && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{item.comment}"
                      </p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatIfGame;