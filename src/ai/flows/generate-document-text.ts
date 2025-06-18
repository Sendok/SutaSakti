'use server';

/**
 * @fileOverview Generates document text using AI based on user inputs.
 *
 * - generateDocumentText - A function that generates document text.
 * - GenerateDocumentTextInput - The input type for the generateDocumentText function.
 * - GenerateDocumentTextOutput - The return type for the generateDocumentText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentTextInputSchema = z.object({
  documentType: z.string().describe('The type of document to generate (e.g., cover letter, invoice, contract, academic paper).'),
  userInput: z.string().describe('User input to guide the AI in generating the document text.'),
});
export type GenerateDocumentTextInput = z.infer<typeof GenerateDocumentTextInputSchema>;

const GenerateDocumentTextOutputSchema = z.object({
  generatedText: z.string().describe('The AI-generated text for the document.'),
});
export type GenerateDocumentTextOutput = z.infer<typeof GenerateDocumentTextOutputSchema>;

export async function generateDocumentText(input: GenerateDocumentTextInput): Promise<GenerateDocumentTextOutput> {
  return generateDocumentTextFlow(input);
}

const generateDocumentTextPrompt = ai.definePrompt({
  name: 'generateDocumentTextPrompt',
  input: {schema: GenerateDocumentTextInputSchema},
  output: {schema: GenerateDocumentTextOutputSchema},
  prompt: `You are an AI assistant specialized in generating documents.

  Based on the document type and user input, generate the text for the document.

  Document Type: {{{documentType}}}
  User Input: {{{userInput}}}

  Generated Text:`,
});

const generateDocumentTextFlow = ai.defineFlow(
  {
    name: 'generateDocumentTextFlow',
    inputSchema: GenerateDocumentTextInputSchema,
    outputSchema: GenerateDocumentTextOutputSchema,
  },
  async input => {
    const {output} = await generateDocumentTextPrompt(input);
    return output!;
  }
);
