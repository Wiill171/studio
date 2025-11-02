'use server';

/**
 * @fileOverview Identifies bird species from a textual description.
 *
 * - identifyBirdFromDescription - A function that handles the bird identification process from text.
 * - IdentifyBirdFromDescriptionInput - The input type for the identifyBirdFromDescription function.
 * - IdentifyBirdFromDescriptionOutput - The return type for the identifyBirdFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyBirdFromDescriptionInputSchema = z.object({
  description: z.string().describe('A textual description of the bird.'),
});
export type IdentifyBirdFromDescriptionInput = z.infer<
  typeof IdentifyBirdFromDescriptionInputSchema
>;

const BirdSuggestionSchema = z.object({
    name: z.string().describe("The common name of the suggested bird."),
    confidence: z.number().describe("The confidence level of the suggestion (0-1)."),
    description: z.string().describe("A brief description of the bird species."),
    imageUrl: z.string().optional().describe("A URL to an image of the bird."),
    imageHint: z.string().optional().describe("A hint for AI image generation."),
});

const IdentifyBirdFromDescriptionOutputSchema = z.object({
  birds: z
    .array(BirdSuggestionSchema)
    .describe('A list of possible bird species matching the description.'),
});
export type IdentifyBirdFromDescriptionOutput = z.infer<
  typeof IdentifyBirdFromDescriptionOutputSchema
>;

export async function identifyBirdFromDescription(
  input: IdentifyBirdFromDescriptionInput
): Promise<IdentifyBirdFromDescriptionOutput> {
  return identifyBirdFromDescriptionFlow(input);
}


const prompt = ai.definePrompt({
    name: 'identifyBirdFromDescriptionPrompt',
    input: { schema: IdentifyBirdFromDescriptionInputSchema.extend({ birds: z.any() }) },
    output: { schema: IdentifyBirdFromDescriptionOutputSchema },
    prompt: `Você é um ornitólogo especialista. Sua tarefa é identificar espécies de pássaros a partir de uma descrição textual fornecida por um usuário.

    Analise a descrição a seguir e forneça uma lista de 1 a 3 possíveis espécies de pássaros que correspondam à descrição. Para cada pássaro, forneça o nome da espécie, um nível de confiança (0-1) e uma breve descrição.

    Considere a lista de pássaros conhecidos para guiar suas sugestões. Mapeie suas sugestões para os pássaros desta lista sempre que possível.

    Pássaros Conhecidos:
    {{#each birds}}
    - {{this.name}}
    {{/each}}

    Descrição do usuário:
    "{{{description}}}"

    Responda em português do Brasil. Para a descrição na saída, use a descrição exata da lista de Pássaros Conhecidos, se houver uma correspondência. Associe também o imageHint e imageUrl da lista de pássaros conhecidos.
    `
});


const identifyBirdFromDescriptionFlow = ai.defineFlow(
  {
    name: 'identifyBirdFromDescriptionFlow',
    inputSchema: IdentifyBirdFromDescriptionInputSchema,
    outputSchema: IdentifyBirdFromDescriptionOutputSchema,
  },
  async (input) => {
    // This is a workaround to use fetch in a Genkit flow on Next.js
    const fetch = ((global as any).fetch);

    // Fetch birds from the local API
    // The base URL needs to be absolute for server-side fetching.
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
      : 'http://localhost:9002';
      
    const response = await fetch(`${baseUrl}/api/birds`);
    if (!response.ok) {
        throw new Error('Failed to fetch birds from local API');
    }
    const birds = await response.json();


    const { output } = await prompt({
        ...input,
        birds,
    });
    // Add imageUrl and imageHint to the output from the known birds list
    const augmentedBirds = output!.birds.map(suggestedBird => {
        const knownBird = birds.find((b: any) => b.name === suggestedBird.name);
        if (knownBird) {
            return {
                ...suggestedBird,
                imageUrl: knownBird.imageUrl,
                imageHint: knownBird.imageHint,
            };
        }
        return suggestedBird;
    });

    return { birds: augmentedBirds };
  }
);
