'use server';

/**
 * @fileOverview Identifies a bird species from a photo using AI.
 *
 * - identifyBirdFromPhoto - A function that identifies a bird species from a photo.
 * - IdentifyBirdFromPhotoInput - The input type for the identifyBirdFromPhoto function.
 * - IdentifyBirdFromPhotoOutput - The return type for the identifyBirdFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyBirdFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a bird, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyBirdFromPhotoInput = z.infer<typeof IdentifyBirdFromPhotoInputSchema>;

const IdentifyBirdFromPhotoOutputSchema = z.object({
  species: z.string().describe('The identified species of the bird.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  description: z.string().describe('A brief description of the bird species.'),
});
export type IdentifyBirdFromPhotoOutput = z.infer<typeof IdentifyBirdFromPhotoOutputSchema>;

export async function identifyBirdFromPhoto(input: IdentifyBirdFromPhotoInput): Promise<IdentifyBirdFromPhotoOutput> {
  return identifyBirdFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyBirdFromPhotoPrompt',
  input: {schema: IdentifyBirdFromPhotoInputSchema},
  output: {schema: IdentifyBirdFromPhotoOutputSchema},
  prompt: `You are an expert ornithologist. Your task is to identify the species of a bird from a photo.

  Analyze the following photo and provide the species name, a confidence level (0-1), and a brief description of the bird.

  Photo: {{media url=photoDataUri}}
  {
    "species": "string",
    "confidence": number,
    "description": "string"
  }`,
});

const identifyBirdFromPhotoFlow = ai.defineFlow(
  {
    name: 'identifyBirdFromPhotoFlow',
    inputSchema: IdentifyBirdFromPhotoInputSchema,
    outputSchema: IdentifyBirdFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
