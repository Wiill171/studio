'use server';

/**
 * @fileOverview Identifies bird species from an audio recording of their song.
 *
 * - identifyBirdFromSong - A function that handles the bird song identification process.
 * - IdentifyBirdFromSongInput - The input type for the identifyBirdFromSong function.
 * - IdentifyBirdFromSongOutput - The return type for the identifyBirdFromSong function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyBirdFromSongInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'An audio recording of a bird song, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type IdentifyBirdFromSongInput = z.infer<typeof IdentifyBirdFromSongInputSchema>;

const IdentifyBirdFromSongOutputSchema = z.object({
  species: z.string().describe('The identified species of the bird.'),
  confidence: z
    .number()
    .describe('The confidence level of the identification (0-1).'),
  alternativeSpecies: z
    .array(z.string())
    .optional()
    .describe('Alternative bird species suggestions, if any.'),
});
export type IdentifyBirdFromSongOutput = z.infer<typeof IdentifyBirdFromSongOutputSchema>;

export async function identifyBirdFromSong(
  input: IdentifyBirdFromSongInput
): Promise<IdentifyBirdFromSongOutput> {
  return identifyBirdFromSongFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyBirdFromSongPrompt',
  input: {schema: IdentifyBirdFromSongInputSchema},
  output: {schema: IdentifyBirdFromSongOutputSchema},
  prompt: `Você é um ornitólogo especialista em identificar pássaros por seus cantos.

Você usará a gravação de áudio fornecida para identificar a espécie do pássaro.

Analise a seguinte gravação de áudio:

{{media url=audioDataUri}}

Produza a espécie identificada, seu nível de confiança (0-1) e quaisquer sugestões de espécies alternativas.

Responda em português do Brasil.

Certifique-se de que a saída esteja formatada como um objeto JSON que corresponda ao IdentifyBirdFromSongOutputSchema. A confiança deve ser alta se o canto for claro.
`,
});

const identifyBirdFromSongFlow = ai.defineFlow(
  {
    name: 'identifyBirdFromSongFlow',
    inputSchema: IdentifyBirdFromSongInputSchema,
    outputSchema: IdentifyBirdFromSongOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
