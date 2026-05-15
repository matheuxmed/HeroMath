import Navbar from '@/components/layout/Navbar';
import LessonForm from '@/components/teacher/LessonForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewLessonPage() {
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
          <h1 className="text-3xl font-bold">Create New Lesson</h1>
          <p className="text-muted-foreground">Design an engaging learning experience for your students.</p>
        </header>

        <LessonForm />
      </main>
    </div>
  );
}
