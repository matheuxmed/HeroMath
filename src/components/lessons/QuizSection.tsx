"use client"

import { useState } from 'react';
import { Question } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizSectionProps {
  questions: Question[];
}

export default function QuizSection({ questions }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQ = questions[currentIdx];

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      reset();
    }
  };

  const reset = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  if (questions.length === 0) return null;

  return (
    <div className="my-12 p-6 border-y bg-accent/5 rounded-xl border-accent/20">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        Practice Question {currentIdx + 1} of {questions.length}
      </h3>
      
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-lg font-medium leading-relaxed">
            {currentQ.prompt}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {currentQ.type === 'multiple-choice' ? (
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-3"
            >
              {currentQ.options?.map((opt) => (
                <div key={opt} className={cn(
                  "flex items-center space-x-3 border p-4 rounded-lg transition-all cursor-pointer hover:bg-background",
                  selectedAnswer === opt && !isSubmitted && "border-primary bg-primary/5",
                  isSubmitted && opt === currentQ.correctAnswer && "border-accent bg-accent/10 ring-1 ring-accent",
                  isSubmitted && selectedAnswer === opt && opt !== currentQ.correctAnswer && "border-destructive bg-destructive/5"
                )}>
                  <RadioGroupItem value={opt} id={opt} />
                  <Label htmlFor={opt} className="flex-grow cursor-pointer text-base">
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Type your answer here..."
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isSubmitted}
                className="h-12 text-lg"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0 mt-8 flex flex-col items-start gap-4">
          {!isSubmitted ? (
            <Button 
              className="w-full sm:w-auto px-8" 
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <div className="w-full space-y-6">
              <div className={cn(
                "p-4 rounded-lg border flex gap-4 items-start animate-in zoom-in-95",
                isCorrect ? "bg-accent/10 border-accent" : "bg-destructive/5 border-destructive"
              )}>
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-1" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
                )}
                <div>
                  <p className="font-bold mb-1">
                    {isCorrect ? "Great job!" : "Not quite right."}
                  </p>
                  <p className="text-sm opacity-90">{currentQ.explanation}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                {currentIdx < questions.length - 1 ? (
                  <Button onClick={handleNext} className="gap-2">
                    Next Question <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setCurrentIdx(0)} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Restart Quiz
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}