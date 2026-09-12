import { z } from "zod";

export const fearProfileSchema = z.object({
  fearLabel: z.string().min(1),
  entity: z.string().min(1),
  setting: z.string().min(1),
  timeOfDay: z.string().min(1),
  weather: z.string().min(1),
  seedImagePrompt: z.string().min(1),
  worldPrompt: z.string().min(1).max(1400),
  escalationPrompt: z.string().min(1).max(350),
  audioPrompt: z.string().min(1).max(200),
  notebookLines: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
});

/*
 * Strict Structured Outputs cannot represent tuples — the wire schema asks
 * for three named lines; the route assembles them into notebookLines and
 * validates against fearProfileSchema.
 */
export const openaiProfileSchema = fearProfileSchema
  .omit({ notebookLines: true })
  .extend({
    notebookLine1: z.string().min(1),
    notebookLine2: z.string().min(1),
    notebookLine3: z.string().min(1),
  });

export const profileRequestSchema = z.object({
  answers: z.tuple([
    z.string().min(1).max(500),
    z.string().min(1).max(500),
    z.string().min(1).max(500),
    z.string().min(1).max(500),
  ]),
});
