"use client"

import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';
import QuizSection from '@/components/lessons/QuizSection';
import AIExplainer from '@/components/lessons/AIExplainer';
import { ChevronLeft, BookOpen, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Lesson } from '@/lib/types';
import { useMemo, use } from 'react';
import { notFound } from 'next/navigation';

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  
  const lessonRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, 'lessons', id);
  }, [db, id]);

  const { data: lesson, loading } = useDoc<Lesson>(lessonRef);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-10">
            <Link href="/lessons">
              <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Lessons
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs uppercase tracking-wider">{lesson.topic}</Badge>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~15 min read</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {lesson.title}
            </h1>
          </div>

          <article 
            className="math-content prose prose-slate lg:prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />

          <section className="mt-16 pt-12 border-t">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Check Your Understanding
            </h2>
            <QuizSection questions={lesson.questions} />
          </section>

          <div className="py-20 text-center border-t mt-12">
            <h3 className="text-2xl font-bold mb-4">You've finished this lesson!</h3>
            <p className="text-muted-foreground mb-8">Ready for the next challenge?</p>
            <Link href="/lessons">
              <Button size="lg" className="rounded-full px-10">
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <AIExplainer currentConcept={lesson.topic + ": " + lesson.title} />
    </div>
  );
}
