"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lesson } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save, HelpCircle } from 'lucide-react';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple-choice', 'fill-in-the-blank']),
  prompt: z.string().min(5, "Question prompt is too short"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  explanation: z.string().min(10, "Explanation should be more detailed"),
});

const lessonSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  topic: z.string().min(2, "Topic is required"),
  content: z.string().min(20, "Content must be more substantial"),
  questions: z.array(questionSchema).min(1, "At least one quiz question is required"),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  initialData?: Lesson;
  isEditing?: boolean;
}

export default function LessonForm({ initialData, isEditing = false }: LessonFormProps) {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      topic: initialData.topic,
      content: initialData.content,
      questions: initialData.questions,
    } : {
      title: '',
      topic: '',
      content: '',
      questions: [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'multiple-choice',
          prompt: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control: form.control,
  });

  async function onSubmit(values: LessonFormValues) {
    if (!db || !user) return;
    setLoading(true);
    
    const lessonsCollection = collection(db, 'lessons');
    const lessonRef = isEditing && initialData 
      ? doc(db, 'lessons', initialData.id) 
      : doc(lessonsCollection);
    
    const lessonId = lessonRef.id;
    const lessonData = {
      ...values,
      id: lessonId,
      authorId: user.uid,
      createdAt: isEditing && initialData ? initialData.createdAt : new Date().toISOString(),
    };

    setDoc(lessonRef, lessonData, { merge: true })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: lessonRef.path,
          operation: isEditing ? 'update' : 'create',
          requestResourceData: lessonData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    setLoading(false);
    router.push('/teacher');
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto pb-24">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction to Calculus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Calculus, Algebra, Geometry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Content (HTML supported)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your lesson content here..." 
                      className="min-h-[300px] font-mono"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, and &lt;code&gt; for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Quiz Questions
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({
                id: Math.random().toString(36).substr(2, 9),
                type: 'multiple-choice',
                prompt: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                explanation: '',
              })}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="border-none shadow-sm relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-sm">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${index}.prompt`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Prompt</FormLabel>
                      <FormControl>
                        <Input placeholder="What is the question?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((optIdx) => (
                    <FormField
                      key={optIdx}
                      control={form.control}
                      name={`questions.${index}.options.${optIdx}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Option {optIdx + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Choice ${optIdx + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name={`questions.${index}.correctAnswer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <FormControl>
                        <Input placeholder="Must match one of the options exactly" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`questions.${index}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain why this answer is correct..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t z-50">
          <div className="max-w-4xl mx-auto flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-8" 
              disabled={loading || !user}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : isEditing ? "Update Lesson" : "Publish Lesson"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
