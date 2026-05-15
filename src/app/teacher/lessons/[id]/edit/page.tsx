"use client"

import Navbar from '@/components/layout/Navbar';
import LessonForm from '@/components/teacher/LessonForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Lesson } from '@/lib/types';
import { useMemo, use } from 'react';
import { notFound } from 'next/navigation';

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <header className="mb-8">
          <Link href="/teacher">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Lesson: {lesson.title}</h1>
          <p className="text-muted-foreground">Update the content and quiz for your students.</p>
        </header>

        <LessonForm initialData={lesson} isEditing />
      </main>
    </div>
  );
}
