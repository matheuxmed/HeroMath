"use client"

import Navbar from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Lesson } from '@/lib/types';
import { useMemo } from 'react';

export default function LessonsPage() {
  const db = useFirestore();
  
  const lessonsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'lessons'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: lessons, loading } = useCollection<Lesson>(lessonsQuery);

  const getLessonImage = (topic: string) => {
    const images = PlaceHolderImages || [];
    const algebraImg = images.find(i => i.id === 'lesson-algebra')?.imageUrl;
    const calculusImg = images.find(i => i.id === 'lesson-calculus')?.imageUrl;
    const heroImg = images.find(i => i.id === 'hero-math')?.imageUrl;

    if (topic.toLowerCase().includes('algebra')) return algebraImg || heroImg;
    if (topic.toLowerCase().includes('calculus')) return calculusImg || heroImg;
    return heroImg;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <header className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Available Lessons</h1>
          <p className="text-lg text-muted-foreground">Select a topic and begin your journey towards mastery.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your curriculum...</p>
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => {
              const imageSrc = getLessonImage(lesson.topic);
              return (
                <Card key={lesson.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {imageSrc && (
                      <Image 
                        src={imageSrc} 
                        alt={lesson.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-primary hover:bg-white">{lesson.topic}</Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3" />
                      <span>Created {new Date(lesson.createdAt).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{lesson.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="line-clamp-2 text-base">
                      Explore the foundational concepts of {lesson.topic.toLowerCase()} through interactive steps and practice problems.
                    </CardDescription>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Link href={`/lessons/${lesson.id}`} className="w-full">
                      <Button className="w-full group/btn" variant="secondary">
                        View Lesson 
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No lessons yet</h3>
            <p className="text-muted-foreground mb-6">Our teachers are currently preparing new content.</p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
