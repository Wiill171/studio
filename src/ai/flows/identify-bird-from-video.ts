'use server';

/**
 * @fileOverview Identifies a bird species from a video using AI.
 *
 * - identifyBirdFromVideo - A function that identifies a bird species from a video.
 * - IdentifyBirdFromVideoInput - The input type for the identifyBirdFromVideo function.
 * - IdentifyBirdFromVideoOutput - The return type for the identifyBirdFromVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyBirdFromVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a bird, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyBirdFromVideoInput = z.infer<typeof IdentifyBirdFromVideoInputSchema>;

const IdentifyBirdFromVideoOutputSchema = z.object({
  species: z.string().describe('The identified species of the bird.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  description: z.string().describe('A brief description of the bird species.'),
});
export type IdentifyBirdFromVideoOutput = z.infer<typeof IdentifyBirdFromVideoOutputSchema>;

export async function identifyBirdFromVideo(input: IdentifyBirdFromVideoInput): Promise<IdentifyBirdFromVideoOutput> {
  return identifyBirdFromVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyBirdFromVideoPrompt',
  input: {schema: IdentifyBirdFromVideoInputSchema},
  output: {schema: IdentifyBirdFromVideoOutputSchema},
  prompt: `Você é um ornitólogo especialista. Sua tarefa é identificar a espécie de um pássaro a partir de um vídeo.

  Analise o vídeo a seguir e forneça o nome da espécie, um nível de confiança (0-1) e uma breve descrição da ave. O pássaro pode estar se movendo, então analise os quadros para obter uma identificação clara.

  Responda em português do Brasil.

  Vídeo: {{media url=videoDataUri}}
  {
    "species": "string",
    "confidence": number,
    "description": "string"
  }`,
});

const identifyBirdFromVideoFlow = ai.defineFlow(
  {
    name: 'identifyBirdFromVideoFlow',
    inputSchema: IdentifyBirdFromVideoInputSchema,
    outputSchema: IdentifyBirdFromVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
