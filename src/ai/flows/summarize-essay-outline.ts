'use server';

/**
 * @fileOverview A flow that generates an essay draft from an outline.
 *
 * - summarizeEssayOutline - A function that generates an essay draft from an outline.
 * - SummarizeEssayOutlineInput - The input type for the summarizeEssayOutline function.
 * - SummarizeEssayOutlineOutput - The return type for the summarizeEssayOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEssayOutlineInputSchema = z.object({
  outline: z.string().describe('The outline of the essay.'),
});
export type SummarizeEssayOutlineInput = z.infer<typeof SummarizeEssayOutlineInputSchema>;

const SummarizeEssayOutlineOutputSchema = z.object({
  essayDraft: z.string().describe('The generated essay draft.'),
});
export type SummarizeEssayOutlineOutput = z.infer<typeof SummarizeEssayOutlineOutputSchema>;

export async function summarizeEssayOutline(input: SummarizeEssayOutlineInput): Promise<SummarizeEssayOutlineOutput> {
  return summarizeEssayOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEssayOutlinePrompt',
  input: {schema: SummarizeEssayOutlineInputSchema},
  output: {schema: SummarizeEssayOutlineOutputSchema},
  prompt: `You are an expert essay writer. Generate an essay draft based on the following outline:\n\n{{{outline}}}`,
});

const summarizeEssayOutlineFlow = ai.defineFlow(
  {
    name: 'summarizeEssayOutlineFlow',
    inputSchema: SummarizeEssayOutlineInputSchema,
    outputSchema: SummarizeEssayOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
