
"use client"

import Link from 'next/link';
import { BookOpen, User as UserIcon, LogOut, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
  const isTeacherPath = pathname.includes('/teacher');

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight">
            <BookOpen className="h-6 w-6" />
            <span>MathMentor</span>
          </Link>
          
          <div className="hidden md:flex gap-4">
            <Link 
              href="/lessons" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === '/lessons' ? "text-primary" : "text-muted-foreground"
              )}
            >
              Lessons
            </Link>
            <Link 
              href="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === '/dashboard' ? "text-primary" : "text-muted-foreground"
              )}
            >
              My Progress
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isTeacherPath ? (
                <Link href="/teacher">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Manage
                  </Button>
                </Link>
              ) : (
                <Link href="/teacher">
                  <Button variant="outline" size="sm">
                    Teacher Portal
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleLogin} variant="default" size="sm" className="gap-2" disabled={loading}>
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
