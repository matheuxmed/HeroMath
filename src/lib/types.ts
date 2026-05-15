export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-in-the-blank';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  content: string; // Markdown/HTML content
  videoUrl?: string;
  questions: Question[];
  authorId: string;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  lastAttempt: string;
}