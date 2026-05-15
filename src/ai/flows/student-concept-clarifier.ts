'use server';
/**
 * @fileOverview A generative AI tool to clarify difficult math concepts.
 *
 * - clarifyMathConcept - A function that handles the math concept clarification process.
 * - ClarifyMathConceptInput - The input type for the clarifyMathConcept function.
 * - ClarifyMathConceptOutput - The return type for the clarifyMathConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClarifyMathConceptInputSchema = z.object({
  mathConcept: z.string().describe('The specific math concept the student needs clarification on.'),
  studentQuestion: z.string().describe('The student\'s specific question or area of confusion about the concept.'),
});
export type ClarifyMathConceptInput = z.infer<typeof ClarifyMathConceptInputSchema>;

const ClarifyMathConceptOutputSchema = z.object({
  explanation: z.string().describe('A clear, alternative, or more detailed explanation of the math concept, tailored to the student\'s question.'),
});
export type ClarifyMathConceptOutput = z.infer<typeof ClarifyMathConceptOutputSchema>;

export async function clarifyMathConcept(input: ClarifyMathConceptInput): Promise<ClarifyMathConceptOutput> {
  return clarifyMathConceptFlow(input);
}

const clarifyMathConceptPrompt = ai.definePrompt({
  name: 'clarifyMathConceptPrompt',
  input: {schema: ClarifyMathConceptInputSchema},
  output: {schema: ClarifyMathConceptOutputSchema},
  prompt: `You are a helpful and patient math tutor named MathMentor. Your goal is to provide clear, concise, and easy-to-understand explanations for math concepts.\n\nThe student is asking for clarification on the following math concept: "{{{mathConcept}}}"\n\nHere is the student's specific question: "{{{studentQuestion}}}"\n\nPlease provide an explanation that addresses the student's question and helps them understand the concept better. If possible, offer an alternative explanation or a different perspective to aid their learning.`,
});

const clarifyMathConceptFlow = ai.defineFlow(
  {
    name: 'clarifyMathConceptFlow',
    inputSchema: ClarifyMathConceptInputSchema,
    outputSchema: ClarifyMathConceptOutputSchema,
  },
  async input => {
    const {output} = await clarifyMathConceptPrompt(input);
    return output!;
  }
);
