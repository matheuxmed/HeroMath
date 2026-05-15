import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookOpen, Award, Zap, Users, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-math');
  const heroImageUrl = heroImage?.imageUrl;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold mb-6">
                  <Zap className="h-4 w-4" />
                  <span>The future of math learning is here</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                  Master Math with <span className="text-primary">Interactive</span> Clarity
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
                  Step into a classroom designed for deep understanding. Interactive lessons, instant feedback, and AI-powered tutoring at your fingertips.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href="/lessons">
                    <Button size="lg" className="px-8 text-lg font-semibold rounded-full h-14 bg-primary hover:bg-primary/90">
                      Explore Lessons
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg" className="px-8 text-lg font-semibold rounded-full h-14">
                      My Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative bg-muted">
                  {heroImageUrl ? (
                    <>
                      <Image 
                        src={heroImageUrl} 
                        alt="Interactive Math" 
                        fill 
                        className="object-cover"
                        data-ai-hint="math geometry"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-24 w-24 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                {/* Floating UI Elements Mockups */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-bounce duration-[3s] hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Concept Mastered!</p>
                      <p className="text-xs text-muted-foreground">Derivatives Section</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MathMentor?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built by educators, powered by innovation. We focus on the "Aha!" moment.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Interactive Lessons",
                  desc: "Visualize complex concepts with embedded media and interactive elements.",
                  icon: BookOpen,
                  color: "text-blue-500",
                  bg: "bg-blue-50"
                },
                {
                  title: "Instant Feedback",
                  desc: "Formative assessments track your understanding in real-time.",
                  icon: Zap,
                  color: "text-amber-500",
                  bg: "bg-amber-50"
                },
                {
                  title: "AI Math Tutor",
                  desc: "Get instant alternative explanations for tricky concepts with our AI explainer.",
                  icon: Users,
                  color: "text-teal-500",
                  bg: "bg-teal-50"
                }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center mb-4", feature.bg)}>
                      <feature.icon className={cn("h-6 w-6", feature.color)} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base pt-2">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to solve the next problem?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are learning math intuitively.
            </p>
            <Link href="/lessons">
              <Button size="lg" variant="secondary" className="rounded-full h-14 px-10 text-lg gap-2">
                Start Learning Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4 font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span>MathMentor</span>
          </div>
          <p className="text-sm">© 2024 MathMentor Educational Platform. Designed for Clarity.</p>
        </div>
      </footer>
    </div>
  );
}