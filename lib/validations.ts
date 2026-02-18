import { z } from 'zod';

export const generationSchema = z.object({
  topic: z.string().min(3).max(500),
  platforms: z.array(z.enum(['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube'])).min(1),
  tone: z.enum(['professional', 'casual', 'enthusiastic', 'informative']),
  variationCount: z.number().min(1).max(5).default(3),
});

export type GenerationRequest = z.infer<typeof generationSchema>;
