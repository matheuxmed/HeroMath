import Navbar from '@/components/layout/Navbar';
import { MOCK_STUDENT, MOCK_LESSONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Award, Clock, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const completedCount = 1;
  const totalLessons = MOCK_LESSONS.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <span className="text-2xl font-bold text-primary">AL</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {MOCK_STUDENT.name}!</h1>
              <p className="text-muted-foreground">Keep up the great momentum.</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="bg-white border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedCount} Lessons</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85% Correct</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2 Hours</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your progress across all topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {MOCK_LESSONS.map((lesson, idx) => (
                  <div key={lesson.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="font-semibold flex items-center gap-2">
                        {idx === 0 ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <BookOpen className="h-4 w-4 text-muted-foreground" />}
                        {lesson.title}
                      </div>
                      <span className="text-muted-foreground">{idx === 0 ? '100%' : '0%'}</span>
                    </div>
                    <Progress value={idx === 0 ? 100 : 0} className="h-2" />
                    {idx === 0 && (
                      <div className="flex gap-2 pt-1">
                        <Badge variant="outline" className="text-[10px] bg-accent/5">Score: 2/2</Badge>
                        <Badge variant="outline" className="text-[10px]">Mastered</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
                  <div className="text-sm">First Lesson Completed</div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg opacity-50 border border-dashed border-white/20">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">?</div>
                  <div className="text-sm">Calculus Master (Locked)</div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-accent/10 rounded-xl border border-accent/20">
              <h3 className="font-bold mb-2">Recommended for you</h3>
              <p className="text-sm text-muted-foreground mb-4">Based on your calculus interest:</p>
              <Link href="/lessons/l2">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-none">
                  Try Pythagorean Theorem
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}