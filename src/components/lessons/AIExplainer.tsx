"use client"

import { useState } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { clarifyMathConcept } from '@/ai/flows/student-concept-clarifier';
import { cn } from '@/lib/utils';

interface AIExplainerProps {
  currentConcept: string;
}

export default function AIExplainer({ currentConcept }: AIExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const result = await clarifyMathConcept({
        mathConcept: currentConcept,
        studentQuestion: question
      });
      setResponse(result.explanation);
    } catch (error) {
      console.error(error);
      setResponse("I'm sorry, I couldn't process that request right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-primary/5">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              AI Concept Clarifier
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              Learning: <strong>{currentConcept}</strong>
            </div>
            
            {response && (
              <div className="bg-accent/10 p-3 rounded text-sm max-h-48 overflow-y-auto border-l-2 border-accent">
                {response}
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="What exactly is confusing you?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="resize-none min-h-[80px] text-sm"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleAsk}
              disabled={loading || !question.trim()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Ask Mentor
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          size="lg" 
          className="rounded-full shadow-lg gap-2 bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="h-5 w-5" />
          Need Help?
        </Button>
      )}
    </div>
  );
}