"use client"

import Navbar from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Users, BookOpen, BarChart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Lesson } from '@/lib/types';
import { useMemo } from 'react';

export default function TeacherDashboard() {
  const db = useFirestore();
  const { user } = useUser();

  const lessonsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'lessons'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: lessons, loading } = useCollection<Lesson>(lessonsQuery);

  const handleDelete = (lessonId: string) => {
    if (!db || !confirm('Are you sure you want to delete this lesson?')) return;
    
    const lessonRef = doc(db, 'lessons', lessonId);
    deleteDoc(lessonRef).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: lessonRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Manage your curriculum and track student performance.</p>
          </div>
          <Link href="/teacher/lessons/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2 h-12 px-6 rounded-full shadow-lg">
              <Plus className="h-5 w-5" />
              Create New Lesson
            </Button>
          </Link>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">-2% from last topic</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active in catalog</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-6">Your Lessons</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="grid gap-4">
            {lessons.map(lesson => (
              <Card key={lesson.id} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-primary/5 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{lesson.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{lesson.topic}</span>
                        <span>•</span>
                        <span>{lesson.questions.length} Questions</span>
                        <span>•</span>
                        <span>Created {new Date(lesson.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/teacher/lessons/${lesson.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit2 className="h-4 w-4" /> Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/5 gap-2 border-destructive/20"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">You haven't created any lessons yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
